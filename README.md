# Digital Heroes - Golf Performance & Charity Platform

Digital Heroes is a premium, subscription-driven web application that combines golf performance tracking, charity fundraising, and a monthly reward engine. It's designed to be emotionally engaging, focusing on charitable impact rather than traditional sport aesthetics.

## 🌟 Key Features

### 🏌️ Golf Performance Tracking
- **Stableford Scoring**: Log your scores (1-45) with date tracking.
- **Rolling Performance**: Only your latest 5 scores are retained, ensuring your current performance drives your reward potential.
- **Seamless Replacement**: New scores automatically replace the oldest ones.

### 🎗️ Charitable Impact
- **Charity Selection**: Choose a cause you care about during signup (e.g., Cancer Research, UNICEF, WWF).
- **Automated Giving**: A minimum of 10% of your subscription goes directly to your chosen charity.
- **Directory**: Explore various charities and their upcoming events.

### 🏆 Monthly Reward Engine
- **Draw Tiers**: Match your golf scores against monthly draw results (3, 4, or 5-number matches).
- **Algorithmic Fairness**: Draws can be random or weighted by community performance.
- **Prize Pools**: Distribution logic ensures 40% for 5-match jackpots, 35% for 4-match, and 25% for 3-match tiers.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Framer Motion (Animations), Lucide (Icons).
- **Backend**: Node.js, Express, TypeScript.
- **Database**: MySQL/MariaDB with **Prisma 7**.
- **Auth**: JWT-based secure authentication.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server running locally

### Installation

1. **Clone and Setup Backend**:
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # DATABASE_URL="mysql://root:password@localhost:3306/digitalheros"
   # JWT_SECRET="your_secret"
   npx prisma db push
   npm run dev
   ```

2. **Setup Frontend**:
   ```bash
   cd digital-heroes-app
   npm install
   npm run dev
   ```

## 📈 Roadmap & Scalability
- **Multi-Country Support**: Architecture ready for regional expansion.
- **Corporate Accounts**: Extensible to teams and corporate fundraising.
- **Mobile App**: Structure optimized for future React Native/Flutter integration.

---
Built with ❤️ by Digital Heroes.
