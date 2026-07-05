# Backup e Restore - Frame24

Procedimentos de backup e restore para o PostgreSQL de produção rodando na VPS
(`174.138.79.19`) em `docker compose -f docker-compose.prod.yml`.

> Tabela de referência rápida:

| Ação            | Comando (na VPS)                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| Backup manual   | `docker exec frame24-postgres pg_dump -U frame24 -Fc frame24 > /opt/backups/frame24_$(date +%F).dump` |
| Listar backups   | `ls -lh /opt/backups/`                                                                                |
| Restore          | `docker exec -i frame24-postgres pg_restore -U frame24 -d frame24 -c < /opt/backups/<file>.dump`     |
| Tamanho do BD    | `docker exec frame24-postgres psql -U frame24 -d frame24 -c "SELECT pg_size_pretty(pg_database_size('frame24'));"` |

---

## 1. Pré-requisitos

- VPS acessível por SSH: `ssh root@174.138.79.19`
- Docker + `docker compose` instalados (já vêm com o `scripts/deploy-vps.sh`)
- Diretório de backups: `/opt/backups/` (criado abaixo)

```bash
ssh root@174.138.79.19 'mkdir -p /opt/backups && chmod 700 /opt/backups'
```

---

## 2. Backup

### 2.1 Backup manual (dump custom-format, comprimido)

```bash
ssh root@174.138.79.19 'docker exec frame24-postgres \
  pg_dump -U frame24 -Fc --no-owner --no-privileges frame24 \
  > /opt/backups/frame24_$(date +%F_%H%M).dump'
```

Flags úteis:

- `-Fc` : custom format (comprimido, paralelizável no restore).
- `--no-owner --no-privileges` : evita problemas com grants divergentes entre ambientes.
- `-j 4` (em `pg_restore`): paralelismo no restore.

### 2.2 Backup automático (cron diário + retenção 14 dias)

Crie em `/opt/backups/backup-frame24.sh` na VPS:

```bash
ssh root@174.138.79.19 'cat > /opt/backups/backup-frame24.sh << "BACKUP"
#!/bin/bash
set -euo pipefail

BACKUP_DIR=/opt/backups
DATE=$(date +%F)
RETENTION_DAYS=14
LOG="$BACKUP_DIR/backup.log"

mkdir -p "$BACKUP_DIR"

echo "[$(date -Is)] Starting backup..." >> "$LOG"

# Dump
docker exec frame24-postgres \
  pg_dump -U frame24 -Fc --no-owner --no-privileges frame24 \
  > "$BACKUP_DIR/frame24_$DATE.dump"

# Verifica que o dump não está vazio
if [ ! -s "$BACKUP_DIR/frame24_$DATE.dump" ]; then
  echo "[$(date -Is)] ERROR: dump empty" >> "$LOG"
  exit 1
fi

# Lista arquivo e tamanho
SIZE=$(du -h "$BACKUP_DIR/frame24_$DATE.dump" | cut -f1)
echo "[$(date -Is)] OK: frame24_$DATE.dump ($SIZE)" >> "$LOG"

# Retention: limpa backups com > 14 dias
find "$BACKUP_DIR" -name "frame24_*.dump" -mtime +$RETENTION_DAYS -delete
echo "[$(date -Is)] Retention: cleaned backups older than $RETENTION_DAYS days" >> "$LOG"

echo "[$(date -Is)] Done." >> "$LOG"
BACKUP
chmod +x /opt/backups/backup-frame24.sh'
```

Adicione ao crontab do root:

```bash
ssh root@174.138.79.19 'crontab -l 2>/dev/null > /tmp/cron; grep -q backup-frame24 /tmp/cron || echo "0 3 * * * /opt/backups/backup-frame24.sh" >> /tmp/cron; crontab /tmp/cron; rm /tmp/cron; crontab -l'
```

Esse roda todo dia às 03:00 da manhã. Logs em `/opt/backups/backup.log`.

### 2.3 Backup offsite (opcional, recomendado)

```bash
# Da sua máquina, sincronize backups da VPS para local
rsync -az --progress root@174.138.79.19:/opt/backups/ ./backups-frame24/

# Ou sync pra um bucket S3 (precisa aws-cli na VPS)
ssh root@174.138.79.19 'aws s3 sync /opt/backups s3://frame24-backups/postgres/ --exclude "backup.log"'
```

---

## 3. Restore

### 3.1 Restore na mesma VPS (sobrescreve produção existente)

> ⚠️ **Isso apaga o estado atual do `frame24` antes de restaurar.**
> Faça um dump do estado atual ANTES de restaurar, caso precise voltar.

```bash
ssh root@174.138.79.19

# 1. Backup de segurança do estado atual
docker exec frame24-postgres pg_dump -U frame24 -Fc frame24 > /opt/backups/frame24_pre_restore_$(date +%F).dump

# 2. (Opcional) Pare a API pra evitar writes durante o restore
docker compose -f /opt/frame24/docker-compose.prod.yml stop api

# 3. Restore: -c (clean) dropa objetos antes de recriar, --if-exists evita erro
docker exec -i frame24-postgres pg_restore \
  -U frame24 -d frame24 \
  -c --if-exists --no-owner --no-privileges \
  < /opt/backups/frame24_2025-01-15.dump

# 4. Rebuild Prisma client (caso schema tenha migrado)
docker compose -f /opt/frame24/docker-compose.prod.yml up -d api
```

### 3.2 Restore em um banco novo (ex: staging)

```bash
ssh root@174.138.79.19

# Crie um banco frame24_staging vazio
docker exec frame24-postgres psql -U frame24 -c "CREATE DATABASE frame24_staging;"

# Restore nele
docker exec -i frame24-postgres pg_restore \
  -U frame24 -d frame24_staging \
  --no-owner --no-privileges \
  < /opt/backups/frame24_2025-01-15.dump
```

### 3.3 Restore local (para debug)

Faça o download do dump e restaure no PostgreSQL local:

```bash
# Da sua máquina
rsync -az root@174.138.79.19:/opt/backups/frame24_2025-01-15.dump /tmp/

# Restaure via docker (assumindo compose up local com container frame24-postgres)
docker exec -i frame24-postgres pg_restore \
  -U frame24 -d frame24 \
  -c --if-exists --no-owner --no-privileges \
  < /tmp/frame24_2025-01-15.dump

# Regenere o client Prisma após mudança de schema
pnpm --filter @repo/db run db:generate
pnpm --filter @repo/db run build
```

---

## 4. Verificação pós-restore

```bash
ssh root@174.138.79.19 << 'EOF'
docker exec frame24-postgres psql -U frame24 -d frame24 -c "
  SELECT
    (SELECT COUNT(*) FROM core.companies)      AS companies,
    (SELECT COUNT(*) FROM crm.customers)        AS crm_customers,
    (SELECT COUNT(*) FROM operations.rooms)     AS rooms,
    (SELECT COUNT(*) FROM catalog.movies)       AS movies
  ;
"
docker compose -f /opt/frame24/docker-compose.prod.yml ps
curl -sf http://localhost:4000/api/openapi.json | head -c 200
EOF
```

Espere contagens não-nulas. Se alguma println"Yeszeror"não bater com o esperado, o restore pode ter falhado parcialmente — cheque `pg_restore` output.

---

## 5. Procedimento de disaster recovery

Cenário: VPS perdeu o volume Postgres.

1. Provisione uma nova VPS (ou use outra).
2. Rode `scripts/deploy-vps.sh` para subir a stack.
3. Traga o último dump offsite de volta para a nova VPS:
   ```bash
   rsync -az ./backups-frame24/frame24_latest.dump root@nova-vps:/tmp/
   ```
4. Siga o [Restore na mesma VPS](#31-restore-na-mesma-vps-sobrescreve-produção-existente) apontando para `/tmp/frame24_latest.dump`.
5. Recrie o admin (caso o dump não tenha `core.identities`):
   ```bash
   docker exec -e BETTER_AUTH_SECRET -e BETTER_AUTH_URL frame24-api \
     node dist/scripts/create-betterauth-admin.js
   ```

---

## 6. Monitoramento

Checagem rápida por SSH:

```bash
# Último backup OK?
ssh root@174.138.79.19 'tail -30 /opt/backups/backup.log'

# Tamanho do backup mais recente
ssh root@174.138.79.19 'ls -lh /opt/backups/frame24_*.dump | tail -3'
```

Para alertar em falha, integre com o n8n webhook — adicione ao final do `backup-frame24.sh`:

```bash
[ -n "${N8N_WEBHOOK_URL:-}" ] && curl -sf -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"event\":\"backup\",\"status\":\"success\",\"size\":\"$SIZE\",\"date\":\"$DATE\"}" \
  || true
```

E capture o exit 1 do script para enviar `status: failed` em caso de erro.

---

## 7. Referência de comandos SQL úteis

```sql
-- Ver todos os schemas
SELECT schema_name FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog','information_schema','pg_toast');

-- Ver tamanho de cada schema
SELECT schema_name, pg_size_pretty(sum(pg_relation_size(quote_ident(schema_name)||'.'||quote_ident(table_name)))::bigint)
FROM information_schema.tables
GROUP BY schema_name ORDER BY 2 DESC;

-- Ver top 15 maiores tabelas
SELECT schemaname||'.'||relname AS relname,
       pg_size_pretty(pg_total_relation_size(relid)) AS size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 15;
```
