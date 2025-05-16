# Student Management System

A full-stack web application built with Next.js 15 and Supabase for managing student records. This application allows users to create, read, update and delete student information with a responsive user interface.

## Features

- ✅ Create, view, update, and delete student records
- ✅ Responsive design for desktop and mobile devices
- ✅ Search functionality to filter students
- ✅ Form validation
- ✅ Toast notifications for user feedback
- ✅ Supabase PostgreSQL database integration

## Tech Stack

- **Frontend**: React 19, Next.js 15, Tailwind CSS 4
- **State Management**: React Hooks
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Supabase account and project

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. In your Supabase dashboard, create a new table called `students` with the following columns:
   - `id`: uuid (primary key)
   - `name`: text (required)
   - `email`: text (required)
   - `phone`: text (required)
   - `gender`: text (required)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd next-perod

# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
next-perod/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   └── students/     # Student API endpoints
│   ├── page.tsx          # Home page with student management UI
│   └── layout.tsx        # Root layout with metadata
├── lib/                  # Utility functions
│   └── supabase.js       # Supabase client configuration
├── public/               # Static assets
└── ...config files
```

## Deployment

The application can be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## License

This project is open source and available under the [MIT License](LICENSE).
