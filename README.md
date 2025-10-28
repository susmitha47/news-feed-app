# News Feed App (React + Vite + Tailwind)

## Features
- Fetches live news from NewsAPI (https://newsapi.org/)
- Search by keyword
- Category filter (Technology, Sports, Business, Health, etc.)
- Pagination
- Dark / Light theme toggle
- Loading and error states

## Setup (locally)
1. Install Node.js (>=16) and npm.
2. Extract the project folder.
3. Copy `.env.example` to `.env` and set `VITE_NEWS_API_KEY` to your NewsAPI key.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the URL printed by Vite (usually http://localhost:5173)

## Notes
- This project uses [NewsAPI.org]. Free tier allows limited requests — consider caching or upgrade if you hit limits.
- If you prefer another API (gnews.io, etc.), update `src/App.jsx` fetch URL accordingly.

## Files included
- `src/` React components and styles
- `tailwind.config.cjs`, `postcss.config.cjs`
- `index.html`, `package.json`

Enjoy — modify and extend as you like!
