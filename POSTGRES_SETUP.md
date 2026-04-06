# PostgreSQL Setup for Real RSS Feeds

## ✅ Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click your `ai-content-aggregator` project**
3. **Go to "Storage" tab**
4. **Click "Create Database" → "Postgres"**
5. **Name:** `ai-content-db`
6. **Click "Create"**

## ✅ Step 2: Get Database URL

1. **Click "Connect" on your new database**
2. **Copy the `DATABASE_URL`** (looks like `postgresql://...`)
3. **Save it** - you'll need it next!

## ✅ Step 3: Add Environment Variable

1. **In Vercel project → "Settings" → "Environment Variables"**
2. **Add new variable:**
   - **Name:** `DATABASE_URL`
   - **Value:** `[paste your PostgreSQL URL]`
   - **Environment:** All (Production, Preview, Development)
3. **Click "Save"**

## ✅ Step 4: Deploy Updated Code

The code is ready! Just need to push:

```bash
git add .
git commit -m "Add PostgreSQL support for real RSS feeds"
git push
```

Vercel will automatically deploy with the new database.

## ✅ Step 5: Run Database Migration

After deployment:

1. **Go to your Vercel project dashboard**
2. **Functions tab** → find the latest deployment
3. **Or use Vercel CLI:**
   ```bash
   npx vercel --prod
   npx vercel env pull .env.local  # Get the DATABASE_URL locally
   npm run db:push                  # Create tables
   npm run db:seed                  # Add RSS sources
   ```

## ✅ Step 6: Test RSS Sync

Visit your live app: `https://ai-content-aggregator-7oen.vercel.app/api/sync`

You should see:
```json
{
  "totalFeeds": 8,
  "successfulFeeds": 8,
  "totalItems": 50+,
  "saved": 50+,
  "errors": []
}
```

## 🎉 Result: Real RSS Content!

- ✅ **Live RSS feeds** from 8 UX/design sources
- ✅ **Fresh content daily** via cron job
- ✅ **Real articles** with working links
- ✅ **Smart processing** and UX-specific tagging
- ✅ **Professional aggregation** ready for users

## 🔧 Local Development

To work locally with the PostgreSQL database:

```bash
# Get environment variables from Vercel
npx vercel env pull .env.local

# Run database operations
npm run db:push    # Create/update tables
npm run db:seed    # Add RSS sources
npm run dev        # Start development server
```

## 📊 Expected Performance

- **50-100+ articles** aggregated daily
- **8 high-quality sources** (Nielsen Norman, UX Collective, etc.)
- **Smart categorization** (UX Research, Design Systems, AI, etc.)
- **Quality scoring** to surface best content
- **Automatic deduplication** by URL