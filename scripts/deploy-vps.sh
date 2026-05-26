#!/bin/bash
set -euo pipefail

VPS_IP="174.138.79.19"
REMOTE_DIR="/opt/frame24"
SSH_USER="root"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10"

echo "============================================"
echo "  Frame24 - Deploy to VPS ${VPS_IP}"
echo "============================================"

# 0. Verify SSH access
echo ""
echo ">>> [0/7] Verifying SSH access..."
if ! ssh ${SSH_OPTS} ${SSH_USER}@${VPS_IP} "echo OK" 2>/dev/null; then
    echo "ERROR: Cannot SSH into ${VPS_IP}. Make sure your SSH key is authorized."
    exit 1
fi
echo "    SSH access OK."

# 1. Setup VPS (Docker, directories)
echo ""
echo ">>> [1/7] Setting up VPS..."

ssh ${SSH_OPTS} ${SSH_USER}@${VPS_IP} bash -s <<'SETUP'
set -e

# Install Docker if not present
if ! command -v docker &>/dev/null; then
    echo "    Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "    Docker installed."
else
    echo "    Docker already installed: $(docker --version)"
fi

# Install docker compose plugin
if ! docker compose version &>/dev/null; then
    echo "    Installing docker-compose plugin..."
    apt-get update -qq
    apt-get install -y -qq docker-compose-plugin
fi

# Install rsync if not present
if ! command -v rsync &>/dev/null; then
    apt-get update -qq
    apt-get install -y -qq rsync
fi

# Create app directory
mkdir -p /opt/frame24

# Open firewall ports
ufw allow 80/tcp 2>/dev/null || true
ufw allow 3000/tcp 2>/dev/null || true
ufw allow 3004/tcp 2>/dev/null || true
ufw allow 4000/tcp 2>/dev/null || true
ufw allow 9000/tcp 2>/dev/null || true

# Increase virtual memory for better performance
sysctl -w vm.max_map_count=262144 2>/dev/null || true
sysctl -w vm.overcommit_memory=1 2>/dev/null || true

echo "    VPS setup complete."

SETUP

# 2. Sync project files to VPS
echo ""
echo ">>> [2/7] Syncing project files to VPS..."

rsync -az --delete \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.turbo' \
    --exclude='.git' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='.env.development.local' \
    --exclude='.env.test.local' \
    --exclude='.env.production.local' \
    --exclude='*.pem' \
    --exclude='.DS_Store' \
    --exclude='coverage' \
    --exclude='.vercel' \
    --exclude='apps/api/dist' \
    /home/law/frame-24/ \
    ${SSH_USER}@${VPS_IP}:${REMOTE_DIR}/

echo "    Files synced."

# 3. Create production .env on VPS
echo ""
echo ">>> [3/7] Setting up environment..."

ssh ${SSH_OPTS} ${SSH_USER}@${VPS_IP} bash -s <<'ENVSETUP'
set -e
cd /opt/frame24

if [ ! -f .env.production ]; then
    cat > .env.production <<'ENVEOF'
# Frame24 Production Environment
# ==========================================

# Database
POSTGRES_PASSWORD=frame24prod2026

# Redis
REDIS_PASSWORD=frame24redis2026

# RabbitMQ
RABBITMQ_PASSWORD=frame24rmq2026

# API
API_URL=http://174.138.79.19:4000
FRONTEND_URL=http://174.138.79.19,http://174.138.79.19:3000,http://174.138.79.19:3004

# Frontend env vars (baked at build time)
NEXT_PUBLIC_API_URL=http://174.138.79.19:4000
NEXT_PUBLIC_SOCKET_URL=http://174.138.79.19:4000
NEXT_PUBLIC_AUTH_URL=http://174.138.79.19:4000
NEXT_PUBLIC_TMDB_API_KEY=b7626214ac55a24c995e552f7940ee24

# Auth secrets
JWT_SECRET=frame24-prod-jwt-secret-k8x2m9p4q7r1t5w3
BETTER_AUTH_SECRET=frame24-prod-auth-secret-v5n3j6h9w2y4m8k1
BETTER_AUTH_URL=http://174.138.79.19:4000

# MinIO Storage
MINIO_ACCESS_KEY=frame24-storage-key
MINIO_SECRET_KEY=frame24-storage-secret-2026
STORAGE_PUBLIC_URL=http://174.138.79.19:9000

# Email
EMAIL_FROM=noreply@frame24.com.br
RESEND_API_KEY=
ENVEOF
    echo "    Created .env.production"
else
    echo "    .env.production already exists, keeping it."
fi

ENVSETUP

# 4. Build Docker images on VPS
echo ""
echo ">>> [4/7] Building Docker images (this takes 5-10 min)..."

ssh ${SSH_OPTS} ${SSH_USER}@${VPS_IP} bash -s <<'BUILD'
set -e
cd /opt/frame24

# Load env
set -a; source .env.production; set +a

echo "    Building API image..."
docker compose -f docker-compose.prod.yml build api 2>&1 | grep -E "(DONE|ERROR|WARN|Step|Building|Successfully)" | tail -20

echo ""
echo "    Building Web image..."
docker compose -f docker-compose.prod.yml build web 2>&1 | grep -E "(DONE|ERROR|WARN|Step|Building|Successfully)" | tail -20

echo ""
echo "    Building Admin image..."
docker compose -f docker-compose.prod.yml build admin 2>&1 | grep -E "(DONE|ERROR|WARN|Step|Building|Successfully)" | tail -20

echo ""
echo "    All images built."

BUILD

# 5. Start all services
echo ""
echo ">>> [5/7] Starting services..."

ssh ${SSH_OPTS} ${SSH_USER}@${VPS_IP} bash -s <<'START'
set -e
cd /opt/frame24

set -a; source .env.production; set +a

docker compose -f docker-compose.prod.yml up -d

echo ""
echo "    Waiting for containers to start..."
sleep 15

docker compose -f docker-compose.prod.yml ps

START

# 6. Run migrations and seed
echo ""
echo ">>> [6/7] Running migrations and seeding database..."

ssh ${SSH_OPTS} ${SSH_USER}@${VPS_IP} bash -s <<'SEED'
set -e
cd /opt/frame24

# Wait for API to be healthy (it runs migrations on startup)
echo "    Waiting for API to complete migrations and start..."
for i in $(seq 1 60); do
    if curl -sf http://localhost:4000/api/openapi.json > /dev/null 2>&1; then
        echo "    API is healthy! (after ${i}0s)"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "    ERROR: API did not start within 10 minutes."
        echo "    Logs:"
        docker compose -f docker-compose.prod.yml logs api --tail=30
        exit 1
    fi
    echo "    Waiting... ($i/60)"
    sleep 10
done

# Check if data already exists
RESULT=$(docker exec frame24-postgres psql -U frame24 -d frame24 -t -c "SELECT COUNT(*) FROM core.companies;" 2>/dev/null | tr -d ' ')
COMPANY_COUNT=$(echo "$RESULT" | head -1 | tr -d '\n')

if [ "$COMPANY_COUNT" -gt "0" ] 2>/dev/null; then
    echo "    Database already has data (companies: $COMPANY_COUNT). Skipping seed."
else
    echo "    Seeding database..."

    # Run setup-full inside API container
    echo "    [1/8] Running setup-full..."
    docker exec frame24-api node dist/scripts/setup-full.js

    echo "    [2/8] Seeding languages..."
    docker exec frame24-api node dist/scripts/seed-languages.js 2>/dev/null || echo "    (skipped or already exists)"

    echo "    [3/8] Seeding seat statuses..."
    docker exec frame24-api node dist/scripts/seed-seat-status.js 2>/dev/null || echo "    (skipped or already exists)"

    echo "    [4/8] Seeding rooms and seats..."
    docker exec frame24-api node dist/scripts/seed-room.js 2>/dev/null || echo "    (skipped or already exists)"

    echo "    [5/8] Seeding products..."
    docker exec frame24-api node dist/scripts/seed-products.js 2>/dev/null || echo "    (skipped or already exists)"

    echo "    [6/8] Seeding POS lookups..."
    docker exec frame24-api node dist/scripts/seed-pos.js 2>/dev/null || echo "    (skipped or already exists)"

    echo "    [7/8] Seeding sales lookups..."
    docker exec frame24-api node dist/scripts/seed-sales-lookups.js 2>/dev/null || echo "    (skipped or already exists)"

    echo "    [8/8] Seeding showtimes..."
    docker exec frame24-api node dist/scripts/seed-showtimes.js 2>/dev/null || echo "    (skipped or already exists)"

    echo ""
    echo "    Creating better-auth admin user..."
    docker exec -e BETTER_AUTH_SECRET -e BETTER_AUTH_URL frame24-api node dist/scripts/create-betterauth-admin.js 2>/dev/null || echo "    (may already exist)"

    echo "    Seed complete!"
fi

SEED

# 7. Final status check
echo ""
echo ">>> [7/7] Final status check..."

ssh ${SSH_OPTS} ${SSH_USER}@${VPS_IP} bash -s <<'STATUS'
set -e
cd /opt/frame24

echo ""
echo "    ============================================="
echo "    DEPLOY COMPLETE!"
echo "    ============================================="
echo ""
echo "    Services:"
docker compose -f docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || docker compose -f docker-compose.prod.yml ps
echo ""
echo "    URLs:"
echo "      Public Web:  http://174.138.79.19:3000"
echo "      Admin Panel: http://174.138.79.19:3004"
echo "      API:         http://174.138.79.19:4000"
echo "      API Docs:    http://174.138.79.19:4000/api/openapi.json"
echo "      MinIO:       http://174.138.79.19:9001"
echo ""
echo "    Admin Login:"
echo "      Email:    admin@lawtrel.com"
echo "      Password: Admin@2026"
echo ""
echo "    Useful commands:"
echo "      View logs:  ssh root@174.138.79.19 'cd /opt/frame24 && docker compose -f docker-compose.prod.yml logs -f'"
echo "      Restart:    ssh root@174.138.79.19 'cd /opt/frame24 && docker compose -f docker-compose.prod.yml restart'"
echo "      Stop:       ssh root@174.138.79.19 'cd /opt/frame24 && docker compose -f docker-compose.prod.yml down'"
echo ""

STATUS
