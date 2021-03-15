<h1 align="center">Sentry → Discord</h1>

<p align="center">
  <img alt="Event Count" src="https://img.shields.io/endpoint?url=https://sentrydiscord.dev/api/badges/events">
  <img alt="Webhook Count" src="https://img.shields.io/endpoint?url=https://sentrydiscord.dev/api/badges/webhooks">
</p>

---

_**Note: Currently in Beta.** I'm working through some serverless database issues and other bugs - don't rely on this for production environments yet unless you're ok missing notifications._

Sentry → Discord is a service for forwarding Sentry event notifications to Discord. It acts as a middleman and transforms the webhook payload into a Discord-compatible format.

You can run your own version of Sentry → Discord or use the free, hosted version at https://sentrydiscord.dev.

## Local Development

To get started in a local environment, you'll need a PostgreSQL instance running locally. Clone the repository and run

    npm install
    npx prisma migrate dev --preview-feature
    npx prisma generate

Next, create a `.env` file with

    DATABASE_URL=postgresql://...

Replacing the postgresql string with the URL to your local database. Finally, run

    npm run dev

You should be able to view the website at http://localhost:3000.

## Capturing Webhook Events

If you want to see what the Webhook payload looks like from Sentry, clone and run this website locally, and use a service like [ngrok](https://ngrok.com/) to get a public URL you can use to point Sentry to it. In development mode the console will print out the full Sentry payload.
