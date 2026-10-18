# Deploy to Render (One-Click)

## Prerequisites
- GitHub repo: https://github.com/Mohit-2803/learning-studio
- Firebase web config (API key, etc.) ready

## Steps

### 1. Create Render Service
1. Go to https://dashboard.render.com
2. Click **New → Web Service**
3. Connect your GitHub repo: `Mohit-2803/learning-studio`
4. Render auto-detects `render.yaml` → click **Create Web Service**

### 2. Add Environment Variables
After creation, go to **Environment** tab and add:

| Key | Value | Source |
|-----|-------|--------|
| `FIREBASE_API_KEY` | Your Firebase web API key | Firebase Console → Project Settings |
| `FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Firebase Console |
| `FIREBASE_PROJECT_ID` | Your project ID | Firebase Console |
| `FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Firebase Console |
| `FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | Firebase Console |
| `FIREBASE_APP_ID` | Your web app ID | Firebase Console |

### 3. Deploy
- Render builds automatically on every push to `main`
- First deploy takes ~2–3 minutes
- Your live URL: `https://learning-studio.onrender.com`

## Health Check
Render pings `/` every 30s. If you want a dedicated endpoint, add to `server.js`:

```js
app.get("/health", (req, res) => res.json({ ok: true }));
```

## Notes
- Free tier: sleeps after 15 min inactivity, wakes on first request (~30s cold start)
- Upgrade to $7/mo Starter for always-on if needed
