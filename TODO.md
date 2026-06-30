# Frame24 - TODO List

## ✅ Completed (This Session)

### Infrastructure Fixes
- [x] Recreated VPS PostgreSQL with fresh volume (initdb error)
- [x] Ran Prisma migrations (`prisma db push --accept-data-loss`)
- [x] Fixed nginx upstream config (container name mismatches)
- [x] Connected all infra containers to correct docker network (`frame-24_frame24-network`)
- [x] Seeded database with admin user (`admin@lawtrel.com` / `Admin@2026`)
- [x] Restored original nginx.conf from local repo

### Deployment
- [x] Synced local git repo (main branch) → VPS `/opt/frame24/`
- [x] Rebuilt admin image on VPS
- [x] Reloaded nginx to pick up new upstream IPs
- [x] Verified all endpoints working

### Team Onboarding
- [x] Documented VS Code Remote SSH setup for colleague
- [x] SSH key workflow documented

---

## 🔄 In Progress / Next Steps

### Bug Fixes (From Original Requirements)
- [ ] Fix seat reservation 5-min auto-release timeout
- [ ] Fix ticket quantity off-by-one (0 shows 0, 1 shows 1)
- [ ] Fix A1/A2 seats showing as "sold" (static data fallback)
- [ ] Complete purchase flow (currently only reserves)
- [ ] Real-time WebSocket seat updates (held status)
- [ ] Remove static `buildSeats()` fallbacks from `data.ts` and `rule-engine.ts`

### Code Quality
- [ ] Fix `SessionBookingPanel` seat label resolution (uses empty `session.seats`)
- [ ] Fix `use-seat-reservation.ts` error handling
- [ ] Fix `PlatformCheckoutExperience` / `CheckoutForm` completion flow
- [ ] Ensure `mapSeatStatus` handles all API status values

### Dev Experience
- [ ] Create `DEVELOPMENT.md` with onboarding guide
- [ ] Add GitHub Actions for auto-deploy on push to `preview/*` branches
- [ ] Create staging subdomain for preview deployments
- [ ] Document database backup/restore procedure

---

## 📋 Backlog

### Features
- [ ] Real-time occupancy indicator
- [ ] Mobile seat selection status bar
- [ ] Loyalty strip integration
- [ ] ML recommendation fields

### Infrastructure
- [ ] Set up monitoring/alerting
- [ ] Configure log aggregation
- [ ] Automate database backups
- [ ] SSL certificate renewal automation

---

## 🐛 Known Issues

1. **Admin 500 error** - Fixed by connecting nginx to correct network
2. **API 502** - Fixed by correcting nginx upstream names
3. **Login 401** - Fixed by running `create-betterauth-admin.js` seed
4. **Static seat data** - A1/A2 show as sold due to `buildSeats()` fallback
5. **Ticket counter** - Off-by-one bug in `use-booking-store.ts`

---

## 📁 Key Files to Remember

| Purpose | File |
|---------|------|
| Local dev env | `apps/web/.env.local` |
| VPS prod compose | `/opt/frame24/docker-compose.prod.yml` |
| Nginx config | `/opt/frame24/infra/nginx.conf` |
| Admin dockerfile | `apps/admin/dockerfile` |
| API dockerfile | `apps/api/dockerfile` |
| Prisma schema | `packages/db/prisma/schema.prisma` |
| Seat map hook | `apps/web/src/hooks/use-showtime-seat-map.ts` |
| Booking store | `apps/web/src/stores/use-booking-store.ts` |

---

## 🚀 Deploy Commands (Reference)

```bash
# Sync code to VPS
rsync -avz --delete /home/law/frame-24/ root@174.138.79.19:/opt/frame24/ --exclude node_modules --exclude .next --exclude .turbo --exclude dist

# Build on VPS
ssh root@174.138.79.19 "cd /opt/frame24 && docker compose -f docker-compose.prod.yml build admin"
ssh root@174.138.79.19 "cd /opt/frame24 && docker compose -f docker-compose.prod.yml up -d admin"

# Reload nginx
ssh root@174.138.79.19 "docker exec frame24-nginx nginx -s reload"

# Seed database
ssh root@174.138.79.19 "docker exec frame24-api node /app/apps/api/dist/scripts/create-betterauth-admin.js"
```