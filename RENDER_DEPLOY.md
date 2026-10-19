# Deploy Learning Studio to Render

The repository's `render.yaml` configures the Node web service to install dependencies, build the Next.js application, and start it with `next start`. Set the Firebase environment variables in the Render service before the first deploy:

| Variable | Value |
| --- | --- |
| `FIREBASE_API_KEY` | Firebase web app API key |
| `FIREBASE_AUTH_DOMAIN` | Firebase project auth domain |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `FIREBASE_APP_ID` | Firebase web app ID |

Add the deployed hostname to Firebase Authentication → Settings → Authorized domains. The Render health check uses `/api/health`. Node.js 20.9 or newer is required.
