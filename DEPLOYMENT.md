# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)

### Quick Deploy
1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the Next.js framework

3. **Configure Environment Variables** in Vercel dashboard:
```
DATABASE_URL=file:./prod.db
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
CONTENT_SYNC_INTERVAL_HOURS=6
```

4. **Deploy**: Vercel will automatically build and deploy

### Database Options for Production

#### Option 1: SQLite with Turso (Recommended for MVP)
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create ai-content-aggregator

# Get connection string
turso db show --url ai-content-aggregator
```

Set `DATABASE_URL` to the Turso URL.

#### Option 2: PostgreSQL (Recommended for Scale)
Use services like:
- **Vercel Postgres** (free tier)
- **Supabase** (free tier)
- **PlanetScale** (MySQL, free tier)

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
}
```

#### Option 3: SQLite (Development Only)
⚠️ **Not recommended for production** - files don't persist on Vercel

### Post-Deployment Setup

1. **Run database migrations**:
```bash
# For external databases
npx prisma migrate deploy

# For SQLite
npx prisma db push
```

2. **Seed the database**:
Visit `https://your-app.vercel.app/api/sync` to populate with initial content

3. **Set up cron sync** (optional):
The `vercel.json` configures automatic sync every 6 hours

## Manual Deployment

### Prerequisites
- Node.js 18+
- Database (PostgreSQL, MySQL, or SQLite)

### Steps
1. **Clone and install**:
```bash
git clone <your-repo>
cd ai-content-aggregator
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
# Edit .env.local with your database URL
```

3. **Setup database**:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. **Build and start**:
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app's public URL |
| `CONTENT_SYNC_INTERVAL_HOURS` | No | How often to sync (default: 24) |
| `MAX_CONTENT_PER_SOURCE` | No | Max items per source (default: 100) |

## Monitoring & Maintenance

### Content Sync
- Automatic sync runs every 6 hours via Vercel cron
- Manual sync: `POST /api/sync`
- Monitor sync status via API response

### Database Maintenance
- Content is automatically deduplicated by URL
- Old content can be archived based on your needs
- Quality scores help identify best content

### Performance
- Database queries are optimized with indexes
- Pagination limits API response sizes
- Static pages cached by Vercel CDN

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check TypeScript compilation: `npm run build`

### Database Issues
- Verify `DATABASE_URL` is correct
- For SQLite: ensure write permissions
- For external DBs: check network connectivity

### Sync Failures
- Check RSS feed URLs are accessible
- Monitor API logs in Vercel dashboard
- RSS feeds may have rate limits or be temporarily down

## Cost Estimates

### Free Tier (MVP)
- **Vercel**: Free (100GB bandwidth, serverless functions)
- **Database**: Turso free tier or Vercel Postgres free tier
- **Total**: $0/month

### Production Scale
- **Vercel Pro**: $20/month (improved limits)
- **Database**: $5-25/month (PostgreSQL/MySQL)
- **Total**: $25-45/month

## Future Upgrades

The architecture supports these upgrades without rebuilding:

1. **AI Processing**: Add OpenAI integration (~$20-50/month)
2. **User Authentication**: Add NextAuth.js (free)
3. **Advanced Analytics**: Add PostHog or similar (~$20/month)
4. **Email Notifications**: Add Resend or similar (~$20/month)