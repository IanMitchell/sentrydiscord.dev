export function getEvent(issue) {
  return issue?.event ?? issue;
}

export function getPlatform(issue) {
  return getEvent(issue)?.platform;
}

export function getLanguage(issue) {
  return getEvent(issue)?.location?.split('.')?.slice(-1)?.[0] || '';
}

export function getContexts(issue) {
  const contexts = getEvent(issue)?.contexts ?? {};
  const values = Object.values(contexts)
    .map((value) => `${value?.name} ${value?.version}`)
    // TODO: Have a better decision tree here
    .filter((value) => value !== 'undefined undefined');

  return values ?? [];
}

export function getExtras(issue) {
  const extras = getEvent(issue)?.extra ?? {};
  const values = Object.entries(extras).map(
    ([key, value]) => `${key}: ${value}`
  );

  return values ?? [];
}

export function getLink(issue) {
  return issue?.url ?? 'https://sentry.io';
}

export function getTags(issue) {
  return getEvent(issue)?.tags ?? [];
}

export function getLevel(issue) {
  return getEvent(issue)?.level;
}

export function getType(issue) {
  return getEvent(issue)?.type;
}

export function getTitle(issue) {
  return getEvent(issue)?.title ?? 'Sentry Event';
}

export function getTime(issue) {
  return new Date(getEvent(issue)?.timestamp * 1000);
}

export function getRelease(issue) {
  return getEvent(issue)?.release;
}

export function getUser(issue) {
  return getEvent(issue)?.user;
}

export function getFileLocation(issue) {
  return getEvent(issue)?.location;
}

export function getStacktrace(issue) {
  return (
    getEvent(issue)?.stacktrace ??
    getEvent(issue)?.exception?.values[0]?.stacktrace
  );
}

export function getErrorLocation(issue, maxLines = Infinity) {
  const stacktrace = getStacktrace(issue);
  const locations = stacktrace?.frames; /*.reverse();*/

  let files = locations?.map(
    (location) =>
      `${location?.filename}, ${location?.lineno ?? '?'}:${
        location?.colno ?? '?'
      }`
  );

  if (maxLines < Infinity && files?.length > maxLines) {
    files = files.slice(0, maxLines);
    files.push('...');
  }

  return files;
}

export function getErrorCodeSnippet(issue) {
  const stacktrace = getStacktrace(issue);
  const location = stacktrace?.frames?.reverse()?.[0];

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
