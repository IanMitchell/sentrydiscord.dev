type SentryIssue = Record<string, any>;

export function getEvent(issue: SentryIssue) {
  return issue?.event ?? issue?.data?.issue ?? issue;
}

export function getProject(issue: SentryIssue) {
  return issue?.project?.project_name ?? getEvent(issue)?.project?.name ?? issue.project_name;
}

export function getPlatform(issue: SentryIssue) {
  return getEvent(issue)?.platform;
}

export function getLanguage(issue: SentryIssue) {
  return getEvent(issue)?.location?.split(".")?.slice(-1)?.[0] || "";
}

export function getContexts(issue: SentryIssue) {
  const contexts = getEvent(issue)?.contexts ?? {};
  const values = Object.values(contexts)
    .map((value: Record<string, unknown>) => `${value?.name} ${value?.version}`)
    // TODO: Have a better decision tree here
    .filter((value) => value !== "undefined undefined");

  return values ?? [];
}

export function getExtras(issue: SentryIssue) {
  const extras = getEvent(issue)?.extra ?? {};
  const values = Object.entries(extras).map(
    ([key, value]) => `${key}: ${value}`
  );

  return values ?? [];
}

export function getLink(issue: SentryIssue) {
  return issue?.url ?? "https://sentry.io";
}

export function getTags(issue: SentryIssue) {
  return getEvent(issue)?.tags ?? [];
}

export function getLevel(issue: SentryIssue) {
  return getEvent(issue)?.level;
}

export function getType(issue: SentryIssue) {
  return getEvent(issue)?.type;
}

export function getTitle(issue: SentryIssue) {
  return getEvent(issue)?.title ?? "Sentry Event";
}

export function getTime(issue: SentryIssue) {
  const event = getEvent(issue);

  if (event?.timestamp) {
    return new Date(getEvent(issue)?.timestamp * 1000);
  }

  if (event?.lastSeen != null) {
    return new Date(event?.lastSeen);
  }

  if (event?.firstSeen != null) {
    return new Date(event?.firstSeen);
  }

  return new Date();
}

export function getRelease(issue: SentryIssue) {
  return getEvent(issue)?.release;
}

export function getUser(issue: SentryIssue) {
  return getEvent(issue)?.user;
}

export function getFileLocation(issue: SentryIssue) {
  return getEvent(issue)?.location;
}

export function getStacktrace(issue: SentryIssue) {
  return (
    getEvent(issue)?.stacktrace ??
    getEvent(issue)?.exception?.values[0]?.stacktrace
  );
}

export function getErrorLocation(issue: SentryIssue, maxLines = Infinity) {
  const stacktrace = getStacktrace(issue);
  const locations = stacktrace?.frames; /*.reverse();*/

  let files = locations?.map(
    (location) =>
      `${location?.filename}, ${location?.lineno ?? "?"}:${
        location?.colno ?? "?"
      }`
  );

  if (maxLines < Infinity && files?.length > maxLines) {
    files = files.slice(0, maxLines);
    files.push("...");
  }

  return files;
}

export function getErrorCodeSnippet(issue: SentryIssue) {
  const stacktrace = getStacktrace(issue);
  const location = stacktrace?.frames?.reverse()?.[0];

  if (!location) {
    const event = getEvent(issue);
    return event?.culprit ?? null;
  }

  // The spaces below are intentional - they help align the code
  // aorund the additional `>` marker
  return ` ${location.pre_context?.join("\n ") ?? ""}\n>${
    location.context_line
  }\n${location.post_context?.join("\n") ?? ""}`;
}

export function getMessage(issue: SentryIssue) {
  return issue?.message;
}
