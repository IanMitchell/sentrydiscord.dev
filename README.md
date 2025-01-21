<h1 align="center">Sentry → Discord</h1>

<p align="center">
  <img alt="Event Count" src="https://img.shields.io/endpoint?url=https://sentrydiscord.dev/api/badges/events">
  <img alt="Webhook Count" src="https://img.shields.io/endpoint?url=https://sentrydiscord.dev/api/badges/webhooks">
  </br>
  <img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/Serpensin/sentrydiscord.dev/docker-image.yml?style=flat-square&label=Action&cacheSeconds=30">
</p>

---

**Note: There was an incident on February 28 which unfortunately resulted in the loss of the production database. The previous data is not recoverable.** I sincerely apologize. You will need to revisit the website and setup your webhooks again.

---

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
