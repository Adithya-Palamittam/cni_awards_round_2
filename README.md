# Restaurant Voting App

A web application for Condé Nast India to facilitate restaurant voting and rating by jury members. The app allows users to select, nominate, and rate restaurants in their assigned region and nationally, with an admin panel for insights and user management.

## Features
- **User Authentication**: Secure login for jury members.
- **Regional Selection**: Jury members select and nominate up to 10 restaurants from their assigned region.
- **National Selection**: Jury members nominate up to 5 restaurants from anywhere in the country.
- **Restaurant Rating**: Rate shortlisted restaurants on a dedicated page.
- **Admin Dashboard**: View user activity, ratings, and restaurant insights.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack
- **Frontend**: React (Vite, TypeScript, Tailwind CSS)
- **Backend**: Node.js (Express)
- **Database**: Supabase (PostgreSQL as a service)
- **State Management**: React Context API
- **UI Components**: Custom and Shadcn/UI

## Project Structure
```
restaurant_voting/
  backend/           # Node.js backend (API, server)
  public/            # Static assets (images, favicon, etc.)
  src/               # Frontend source code
    admin/           # Admin dashboard pages
    components/      # Reusable UI components
    contexts/        # React context providers
    hooks/           # Custom React hooks
    lib/             # Utility libraries (e.g., Supabase client)
    pages/           # Main app pages (user flow)
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd restaurant_voting
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase credentials and other secrets.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173` (or as specified by Vite).


## Deployment
- **Frontend:** Can be deployed to Vercel, Netlify, or any static hosting provider.
- **Backend:** Deploy to services like Heroku, Render, DigitalOcean, or AWS.
- **Database:** Supabase is managed; ensure your environment variables are set for production.

## Contribution Guidelines
1. Fork the repository and create your branch from `main`.
2. Make your changes and add tests if applicable.
3. Ensure code passes linting and formatting checks.
4. Submit a pull request with a clear description of your changes.

## License
This project is for internal use by Condé Nast India. All rights reserved.
