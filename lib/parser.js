export function getPlatform(issue) {
  return issue?.event?.platform;
}

export function getContexts(issue) {
  const contexts = issue?.event?.contexts ?? {};
  const values = Object.values(contexts).map(
    (value) => `${value.name} ${value.version}`
  );

  return values ?? [];
}

export function getLink(issue) {
  return issue?.url ?? 'https://sentry.io';
}

export function getTags(issue) {
  return issue?.event?.tags ?? [];
}

export function getLevel(issue) {
  return issue?.event?.level;
}

export function getType(issue) {
  return issue?.event?.type;
}

export function getTitle(issue) {
  return issue?.event?.title ?? 'Sentry Event';
}

export function getTime(issue) {
  return new Date(issue?.event?.timestamp * 1000);
}

export function getRelease(issue) {
  return issue?.event?.release;
}

export function getUser(issue) {
  return issue?.event?.user;
}

export function getErrorLocation(issue) {
  const stacktrace = issue?.event?.stacktrace;
  const locations = stacktrace?.frames.reverse();

  return locations
    ?.map(
      (location) =>
        `${location?.filename}, ${location?.lineno ?? '?'}:${
          location?.colno ?? '?'
        }`
    )
    ?.join('\n');
}

export function getErrorCodeSnippet(issue) {
  const stacktrace = issue?.event?.stacktrace;
  const location = stacktrace?.frames.reverse()[0];

  if (!location) {
    return null;
  }

  // The spaces below are intentional - they help align the code
  // aorund the additional `>` marker
  return ` ${location.pre_context?.join('\n ') ?? ''}\n>${
    location.context_line
  }\n${location.post_context?.join('\n') ?? ''}`;
}

export function getMessage(issue) {
  return issue?.message;
}
