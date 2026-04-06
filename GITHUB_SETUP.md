# GitHub Setup Commands

After creating your GitHub repository, run these commands:

## 1. Add Remote Repository
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ai-content-aggregator.git
```

## 2. Push to GitHub
```bash
git push -u origin main
```

## 3. Verify Upload
```bash
git remote -v
```

## 4. Update Your Git Config (Optional)
If you want to set your real name and email:
```bash
git config user.name "Your Real Name"
git config user.email "your.email@example.com"
```

## Next: Deploy to Vercel
Once pushed to GitHub, go to:
1. [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your `ai-content-aggregator` repository
4. Vercel will auto-detect Next.js and deploy!

## Environment Variables for Vercel
Set these in your Vercel dashboard:
```
DATABASE_URL=file:./prod.db
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
CONTENT_SYNC_INTERVAL_HOURS=6
```

Your app will be live at: `https://ai-content-aggregator-[random].vercel.app`