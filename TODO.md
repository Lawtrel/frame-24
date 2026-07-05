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
- [x] Fix seat reservation 5-min auto-release timeout — `use-seat-reservation.ts` already has countdown + `release-seats` on expiry; `HoldCountdown` now fires `onExpired` to call `clearBooking()`
- [x] Fix ticket quantity off-by-one (0 shows 0, 1 shows 1) — investigated: not a real bug. `setTicketQuantity` clamps with `Math.max(0, qty)` and display reads `ticketQuantities[code] ?? 0`. Behaviour is correct.
- [x] Fix A1/A2 seats showing as "sold" (static data fallback) — `buildSeats()` does NOT exist in codebase. The "sold" appearance came from merge conflict leftovers in `platform-checkout-experience.tsx` (resolved) + redundant `mapSeatStatus`/`mapApiStatus` mappings (consolidated into single exported `mapSeatStatus`).
- [x] Complete purchase flow (currently only reserves) — `PlatformCheckoutExperience.handleCheckout` now does checkout session → payment attempt → confirm reservation → redirect to `/pedido/{ref}`. Was already there but blocked by unresolved merge conflicts; now working.
- [x] Real-time WebSocket seat updates (held status) — already implemented via `use-showtime-seat-map.ts` (`seats-reserved`/`seats-released`/`seats-confirmed` socket events with live overrides overlay) + `use-seat-reservation.ts` (reservation-* events).
- [x] Remove static `buildSeats()` fallbacks from `data.ts` and `rule-engine.ts` — `buildSeats()` never existed in repo (TODO was stale). `data.ts` ships static cities/cinemas/movies/sessions/concessions for demo (with `seats: []` placeholder) but those are not seat fallbacks.

### Code Quality
- [x] Fix `SessionBookingPanel` seat label resolution (uses empty `session.seats`) — `resolvedSeatLabels` falls back to `selectedSeatLabels[seatId] || seatId`. `LiveSeatMap`/`SeatMap` already call `toggleSeat(seat.id, seat.label)` so labels are captured. Plus `PlatformCheckoutExperience.resolvedSeatLabels` now also reads `showtimeDetails.seats[*].seat_code` for source-of-truth labels.
- [x] Fix `use-seat-reservation.ts` error handling — `reservation-error`/`confirmation-error` already propagate to `reservation.error` state. `PlatformCheckoutExperience` now displays errors in a danger-styled box with icon; legacy fallback message when reservation is gone.
- [x] Fix `PlatformCheckoutExperience` / `CheckoutForm` completion flow — 3 unresolved git merge conflict markers removed (`<<<<<<<`/`=======`/`>>>>>>>`) which were breaking the build; chose the `7689fe0` (custom auth) resolution while preserving `additional_value` pricing for total.
- [x] Ensure `mapSeatStatus` handles all API status values — exported single `mapSeatStatus` (`lib/storefront/api.ts`) now covers: sold/vend, bloq, disabled, occup*, house_held, maintenance, reserv, reserved flag. `use-showtime-seat-map.ts` and `lib/storefront/api.ts` use the same function.

### Dev Experience
- [x] Create `DEVELOPMENT.md` with onboarding guide (see `DEVELOPMENT.md`)
- [x] Add GitHub Actions for auto-deploy on push to `preview/*` branches (see `.github/workflows/deploy-preview.yml`)
- [x] Create staging subdomain for preview deployments (see `infra/nginx-staging.conf` + `docs/BACKUP.md`)
- [x] Document database backup/restore procedure (see `docs/BACKUP.md`)

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
4. ~~**Static seat data** - A1/A2 show as sold due to `buildSeats()` fallback~~ — Removed: `buildSeats()` never existed; real cause was unresolved merge markers in `platform-checkout-experience.tsx` (now resolved).
5. ~~**Ticket counter** - Off-by-one bug in `use-booking-store.ts`~~ — Investigated; not a real bug. `setTicketQuantity` correctly clamps via `Math.max(0, qty)`.

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