# Donate

A full-stack donation platform where creators can create personal donation pages, share their stories, and receive contributions from their community.

## Features

- **Personal Donation Pages** — Each user gets a public profile page at `/profile/:username` where supporters can donate
- **Donation Form** — Card-based payment flow with amount input and test card support
- **Wallet Dashboard** — View total balance, recent donations, and 30-day summary
- **OBS Overlay** — Select donations and open a stream-ready overlay at `/wallet/overlay`
- **Authentication** — Register, login, and protected routes via JWT
- **Legal Pages** — Terms of service, privacy policy, and cookie policy included

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- Tailwind CSS v3
- Axios
- react-hot-toast
- lucide-react

**Backend**
- Go (Fiber v2)
- MongoDB (mongo-driver)
- JWT authentication (golang-jwt)
- bcrypt password hashing

## Project Structure

```
donate/
├── client/          # React frontend
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── hooks/
└── server/          # Go backend
    ├── database/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- MongoDB instance

### Backend

```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, PORT
go run main.go
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Test Payment

The donation form ships with a built-in test card. Click **"Test kartını doldur"** on the donate page or use these details manually:

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | `12/30` |
| CVC | `123` |

> No real payment processing — this is a simulated flow for development/demo purposes.

## Screenshots

![Home](https://raw.githubusercontent.com/favilances/donate/main/donate/Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC_20260224_101302.png)
![Register](https://raw.githubusercontent.com/favilances/donate/main/donate/Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC_20260224_101322.png)
![Profile](https://raw.githubusercontent.com/favilances/donate/main/donate/Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC_20260224_101343.png)
![Donate](https://raw.githubusercontent.com/favilances/donate/main/donate/Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC_20260224_101356.png)
![Wallet](https://raw.githubusercontent.com/favilances/donate/main/donate/Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC_20260224_101452.png)
![OBS Overlay](https://raw.githubusercontent.com/favilances/donate/main/donate/Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC_20260224_101459.png)
![Dashboard](https://raw.githubusercontent.com/favilances/donate/main/donate/Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC_20260224_101507.png)

## Routes

| Path | Description |
|------|-------------|
| `/` | Home / landing page |
| `/register` | Create an account |
| `/login` | Sign in |
| `/profile/:username` | Public profile page |
| `/profile/:username/donate` | Donate to a user |
| `/wallet` | Your wallet & donation history (auth required) |
| `/wallet/overlay` | OBS stream overlay (auth required) |
| `/dashboard` | Profile settings (auth required) |
| `/legal/terms` | Terms of service |
| `/legal/privacy` | Privacy policy |
| `/legal/cookies` | Cookie policy |
