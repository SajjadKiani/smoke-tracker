# Smoke‑Tracker PWA 🚬

A one‑page Next.js 14 App‑Router application that lets smokers log each cigarette and visualises the last year in a GitHub‑style heat‑map.

## 1. Prerequisites

| Tool | macOS (brew) | Ubuntu / Debian (apt) | Windows (choco) |
|------|--------------|-----------------------|-----------------|
| Node 18 + | `brew install node` | `curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -`<br>`sudo apt install -y nodejs` | `choco install nodejs-lts` |
| PostgreSQL 15 | `brew install postgresql@15` | `sudo apt install postgresql-15` | `choco install postgresql15` |

## 2. Local setup

```bash
git clone https://github.com/your-name/smoke-tracker.git
cd smoke-tracker
cp .env.example .env            # fill secrets
npm i
npx prisma migrate dev --name init
npm run dev
