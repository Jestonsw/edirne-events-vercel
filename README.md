# Edirne Events - Vercel Deployment

Modern event management platform for Edirne, Turkey built with Next.js 14.

## Features

- 🎯 Event discovery and management
- 📍 Location-based event filtering  
- 📱 Mobile-responsive design
- 🏪 Venue submission and management
- ⭐ Event rating and review system
- 🔧 Admin panel for content management
- 🌐 Turkish/English/Bulgarian language support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Authentication**: Session-based auth
- **Deployment**: Vercel

## Environment Variables

Required environment variables for Vercel deployment:

```env
DATABASE_URL=postgresql://...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_PASSWORD=your-admin-password
```

## Deployment

1. Fork this repository
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup

```bash
npm run db:push
```

This will push the database schema to your PostgreSQL instance.