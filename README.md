# My discord.js Bot Template

This repository is an ongoing project to extract core pieces of the discord.js bots and ecosystems I run into a reusable template. I'll be using it to bootstrap several bots this year.

## Usage

**Note**: This project has not been fully vetted, deployed, and configured to be secure yet. I'd caution against using it until the Version 1 release.

## Work in Progress Features

- **Message Component Handlers**: There aren't any message component handlers yet. Adding explicit handlers as well as a matcher pattern should happen soon.
- **Better Sentry Integration**: I haven't read through the [Sentry SDK](https://docs.sentry.io/platforms/node/typescript/) to determine what additional aspects I can tie into.
- **Grafana Graphs**: The Grafana image works and pulls metrics, but I haven't added default metrics, dashboards, and graphs yet.

## Unverified Features

- **Sentry**: I haven't verified the Sentry reporting code is accurate or working.
- **LogDNA**: I haven't verified logs successfully send to LogDNA or verified the meta objects or add size checking to them.
- **Prisma**: The deployment and migration workflows are untested.
- **Deployment**: The entire deployment action is untested.
