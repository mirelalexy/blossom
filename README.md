# 🌸 Blossom

> *Can budgeting feel more personal and engaging through customization and gamification?*

Blossom is a personal finance app built around the idea that budgeting works better when it accounts for how you feel, not just what you spend. Every transaction can be tagged with a mood and a purchase intent. Over time, Blossom surfaces patterns — you spend more when anxious, your card average is 40% higher than cash, impulse purchases cluster on Sundays. These aren't insights a spreadsheet gives you.

*Discover Blossom's voice, your own guide to making budgeting feel rewarding.*

---

## Features

### Transactions
- Log expenses and income with amount, title, category, date, payment method (card/cash), mood, and purchase intent (necessary/planned/impulse)
- Recurring transactions: weekly or monthly, auto-generated on each fetch
- Filter by category, type, intent, mood, and date range
- Search by title
- Upcoming section shows future-dated transactions for the current month

### Goals
- Create saving goals with name, target, deadline, notes, and an optional reference link
- Two saving modes: **Auto** (Blossom deposits a calculated monthly amount automatically and logs a transaction) and **Manual** (you add funds yourself)
- Add/withdraw fast
- Primary goal appears on the home screen and can receive budget rollover
- Edit goals without affecting your current saved amount

### Budget
- Monthly spending limit with three rollover options: none, carry forward to next month, or transfer to your primary goal automatically
- Category-level budgets: advisory limits that warn you before logging a transaction that would exceed a category's limit
- Budget snapshot card on the home screen with real-time progress

### Challenges
- 20 challenges across 8 types: mood tagging, streak consistency, budget adherence, transaction counts, small/large expenses, purchase intent, payment method, and goal deposits
- Weekly and monthly challenges evaluated server-side after every transaction

### XP & Levels
- Earn XP for every transaction (5 XP), streak day (2 XP), challenge completed (30 XP), and goal reached (50 XP)
- 8 level titles from Mindful Seed to Eternal Bloom, spread across 100 levels
- Level and progress shown on Profile and Journey

### Streak
- Counts consecutive days with at least one logged transaction
- Milestone awareness at 7, 14, 30, and 60 days
- Streak card messages adapt to your recent mood data and time of day

### Journey
- Browse any past month using the month selector
- 5 charts: spending by category, spending over time, by intent, by mood, income vs expenses
- Deep insight text per chart: not just "what" but "so what"
- 7 pattern cards derived from the last 30 days: weekend vs weekday, card vs cash behaviour, mood-spend correlation, impulse vs planned amounts, recurring impact, savings rate, peak spending day
- Spending style classification (9 types)

### Notifications
- In-app notifications for: level-up, challenge completion, budget warnings (near limit and exceeded), log reminders, and reminders to review your recurring transactions
- Read/unread state: all unread marked as read when you open the Notifications page
- Unread badge on sidebar

### Profile
- Cloudinary avatar and banner: upload, change, or remove
- Files are deleted from Cloudinary on account deletion
- Level card, rewards overview, and challenges preview

### Rewards & Tasks
- Create tasks linked to rewards
- Claim a reward once its task is complete (if it has a cost, a transaction is automatically logged)
- Unclaimed and locked rewards shown separately

### Themes
8 themes: Blossom (warm blush rose, the default), Petal (soft lavender), Forest (earthy sage green), Dusk (warm amber terracotta), Night (dark charcoal with violet), Velvet Rose (dark deep magenta), Abyss (intense dark blue), and Evil Blossom (dark crimson with alternate personality).

> *I get a little different in the dark...*

Need a more direct budgeting partner? Meet Evil Blossom: still Blossom, but darker. This theme changes more than colours. It switches tone for streak messages, greeting, onboarding for new users, app tips, and FAQ.

### Settings
- Account: display name, email, password
- Data & Privacy: export full transaction history as CSV, reset app (wipes all data, keeps account and settings)
- Theme, Notifications (conditional frequency control), Monthly Budget, Categories, Currency, Custom Spending Rules
- Explore App Tips and FAQ

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 |
| Backend | Node.js + Express 5 |
| Database | PostgreSQL |
| Auth | JWT (7-day tokens, stored in localStorage) |
| Image storage | Cloudinary |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Google Fonts |
| Design + Planning | Figma |
| Styling | Custom CSS with CSS variable theming (8 themes) |

---

## Project structure

```
blossom/
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI, forms, charts...
│       ├── data/            # Static content: FAQ, tips
│       ├── hooks/           # App refresh
│       ├── layouts/         # App layout (auth guard + navigation)
│       ├── pages/           # Route-level page components
│       ├── store/           # React Context stores, one per domain
│       ├── styles/          # CSS: global, variables (all themes), components, pages
│       └── utils/           # Date, currency, chart, pattern, insight, streak utilities
└── backend/
    └── db/                  # DB schema
    └── src/
        ├── config/          # Cloudinary config, default categories, default challenges
        ├── controllers/     # Express route handlers
        ├── middleware/      # JWT auth, file upload (Multer)
        ├── routes/          # Express routers
        ├── services/        # Notification service
        └── utils/           # Challenge, level, date, password, media, streak, transactions, user state utilities
                             # XP config
```

---

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### Environment variables

Create `backend/.env`:

```env
PORT=3000
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=blossom
JWT_SECRET=your_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Running locally

```bash
# Terminal 1 (backend)
cd backend
npm install
npm run dev

# Terminal 2 (frontend)
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` by default.

### Database setup

Run the schema SQL file to create all tables, then start the backend. It will seed default categories and challenges on user registration.

---

## What's next?

- Deployment
- Push notifications
- Group features: going on a trip with your friends? Manage your budget by logging transactions together. Saving up for a trip? Make a group and put aside money. Cover for someone else to meet your monthly goal deposit.
- Offline support
- AI analysis for insights
- Further gamification
- Connect with user more: do they recognize their patterns?
- Blossom flower on Home screen to reflect budget health and reflection time

---

*Blossom was built to bring order to the noise, one small step at a time.*