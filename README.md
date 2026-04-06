# AI Content Aggregator for UX Designers

A web application that automatically gathers and curates articles, books, and podcasts about AI for UX designers. Built with a modular architecture for easy upgrades and scalability.

## Features

- 🔍 **Smart Content Aggregation**: RSS feed parsing from key UX/AI sources
- 🏷️ **Intelligent Tagging**: Basic keyword extraction with upgrade path to AI processing
- 🔎 **Powerful Search**: Text-based search with filters for content type, date, and source
- 📱 **Responsive Design**: Clean, modern interface that works on all devices
- 🔧 **Modular Architecture**: Easily upgradeable from basic to AI-powered features

## Tech Stack

- **Frontend**: Next.js 14+ with React & TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Content Processing**: Modular processor system (basic → AI upgradeable)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Initialize the database:
```bash
npm run db:generate
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

7. **Sync content from RSS feeds**:
```bash
npm run sync:content
# or trigger via API: curl -X POST http://localhost:3000/api/sync
```

## 🚀 Deployment

### Quick Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-content-aggregator)

1. **Connect GitHub repository** to Vercel
2. **Set environment variables**:
   - `DATABASE_URL` (use Turso or Vercel Postgres for production)
   - `NEXT_PUBLIC_APP_URL` (your Vercel app URL)
3. **Deploy** - Vercel handles the build automatically
4. **Initial sync**: Visit `/api/sync` to populate with content

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment options and database setup.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run sync:content` - Manually sync content from RSS feeds

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── admin/         # Admin interface components
└── lib/               # Core business logic
    ├── db/            # Database schema and utilities
    ├── processors/    # Content processing modules
    ├── aggregation/   # RSS feed and content aggregation
    └── types/         # TypeScript type definitions
```

## Content Sources

The application aggregates content from curated UX/AI sources including:

- UX design blogs (A List Apart, UX Planet, etc.)
- AI/ML publications
- Design system resources
- Podcast feeds
- Book recommendations

Sources are configurable and can be easily added or removed.

## Modular Architecture

### Content Processors

The system uses a pluggable processor architecture:

- **Basic Processor**: Simple keyword extraction and categorization
- **Manual Processor**: Admin interface for manual tagging (future)
- **AI Processor**: AI-powered content analysis (future)

### Upgrade Paths

The architecture supports several upgrade paths:

1. **Manual Curation**: Add admin interface for content management
2. **AI Processing**: Integrate OpenAI for intelligent content analysis
3. **User Features**: Add authentication and personalization
4. **Community Features**: Enable user collaboration and sharing

## Configuration

Key configuration options in `.env.local`:

- `DATABASE_URL`: Database connection string
- `CONTENT_SYNC_INTERVAL_HOURS`: How often to sync content
- `MAX_CONTENT_PER_SOURCE`: Maximum items per RSS source

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
