# Database Migration Guide - Analytics v3.0

## Overview
This guide covers the database schema changes for the Product Analytics upgrade.

## New Models Added

### 1. ProductView
Tracks car detail page engagement with metrics.

### 2. AnalyticsDailySnapshot
Precomputed daily metrics for fast dashboard queries.

## Migration Steps

### Step 1: Run Prisma Migration

```bash
npx prisma migrate dev --name add_product_analytics
```

This will:
- Add `ProductView` table
- Add `AnalyticsDailySnapshot` table
- Add relations to existing tables (Car, Visitor, Session)

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Verify Migration

```bash
npx prisma studio
```

Check that the new tables exist:
- `ProductView`
- `AnalyticsDailySnapshot`

### Step 4: Backfill Historical Data (Optional)

If you want to generate snapshots for past dates:

```bash
# Call the snapshot API for each past date
curl http://localhost:3000/api/analytics/generate-snapshot
```

### Step 5: Setup Cron Job

For production, setup a cron job to run daily at 2 AM UTC:

```bash
0 2 * * * curl https://yourdomain.com/api/analytics/generate-snapshot
```

Or use Vercel Cron Jobs:

```json
// vercel.json
{
  "crons": [{
    "path": "/api/analytics/generate-snapshot",
    "schedule": "0 2 * * *"
  }]
}
```

## New API Endpoints

1. **POST /api/track-product-view**
   - Tracks car detail page views with engagement metrics
   - Called automatically by `<ProductViewTracker />` component

2. **GET /api/analytics/generate-snapshot**
   - Generates daily snapshot for yesterday's data
   - Should be called via cron job

3. **GET /api/analytics/dashboard?days=30**
   - Returns aggregated analytics data
   - Used by admin analytics dashboard

## Testing

### Test Product Tracking
1. Visit a car detail page: `/cars/[id]`
2. Scroll and spend time on page
3. Navigate away
4. Check database: `SELECT * FROM "ProductView" ORDER BY "viewedAt" DESC LIMIT 10;`

### Test Dashboard
1. Visit `/admin/analytics`
2. Verify KPIs display correctly
3. Check top cars table
4. Verify conversion funnel

## Rollback (If Needed)

```bash
npx prisma migrate reset
```

⚠️ This will delete all data. Only use in development.

## Performance Notes

- ProductView table will grow over time
- Consider adding data retention policy (e.g., keep last 12 months)
- Snapshots prevent expensive aggregation queries
- Indexes are optimized for common queries

## Monitoring

Monitor these metrics:
- ProductView table size
- API response times for `/api/analytics/dashboard`
- Snapshot generation success rate
