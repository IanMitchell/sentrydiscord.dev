type SentryIssue = Record<string, any>;

type SentryStacktrace = {
    frames?: Array<{
        function?: string;
        module?: string;
        filename?: string;
        abs_path?: string;
        lineno?: number;
        pre_context?: Array<string>;
        context_line?: string;
        post_context?: Array<string>;
        in_app?: boolean;
        vars?: Record<string, any>;
        colno?: number;
        data?: Record<string, any>;
    }>;
};

type SentryEvent = {
    event_id: string;
    project: string;
    release?: string;
    dist?: string,
    platform?: string;
    message?: string,
    datetime?: string;
    tags?: Array<[string, string]>;
    _metrics?: Record<string, number>;
    _ref?: number;
    _ref_version?: number;
    contexts?: Record<string, any>;
    culprit?: string;
    environment?: string;
    extra?: Record<string, any>;
    fingerprint?: Array<string>;
    grouping_config?: Record<string, any>;
    hashes?: Array<string>;
    level?: string;
    location?: string;
    logentry?: {
        formatted?: string;
        message?: string;
        params?: Array<string>;
    };
    logger?: string;
    metadata?: Record<string, any>;
    modules?: Record<string, string>;
    nodestore_insert?: number;
    received?: number;
    request?: {
        url?: string;
        method?: string;
        headers?: Record<string, string>;
        data?: string;
        env?: Record<string, string>;
        inferred_content_type?: string;
        api_target?: string;
        cookies?: Record<string, string>;
    };
    stacktrace?: SentryStacktrace;
    timestamp?: number;
    title?: string;
    type?: string;
    user?: {
        id?: string;
        email?: string;
        ip_address?: string;
        username?: string;
        name?: string;
        geo?: {
            country_code?: string;
            region?: string;
            city?: string;
        };
    };
    version?: string;
    url?: string;
    web_url?: string;
    issue_url?: string;
    issue_id?: string;
    exception?: {
        values: Array<{
            type?: string;
            value?: string;
            module?: string;
            mechanism?: {
                type?: string;
                handled?: boolean;
                data?: Record<string, any>;
            };
            stacktrace?: SentryStacktrace;
        }>;
    }
};


export function getEvent(issue: SentryIssue): SentryEvent {
  return issue?.data?.event ?? issue;
}

export function getPlatform(event: SentryEvent) {
    return event?.platform || "unknown";
}

export function getLanguage(event: SentryEvent) {
    return event?.location?.split(".")?.slice(-1)?.[0] || "";
}

export function getContexts(event: SentryEvent) {
    const contexts = getEvent(event)?.contexts ?? {};
    const values = Object.values(contexts)
        .map((value: Record<string, unknown>) => `${value?.name} ${value?.version}`)
        .filter((value) => value !== "undefined undefined");

  return values ?? [];
}

export function getExtras(event: SentryEvent) {
  const extras = event?.extra ?? {};
  const values = Object.entries(extras).map(
    ([key, value]) => `${key}: ${value}`
  );

  return values ?? [];
}

export function getLink(event: SentryEvent) {
    return event?.web_url ?? event?.url ?? "https://sentry.io";
}

export function getTags(event: SentryEvent) {
  return event?.tags ?? [];
}

export function getLevel(event: SentryEvent) {
  return event?.level;
}

export function getType(event: SentryEvent) {
  return event?.type;
}

export function getTitle(event: SentryEvent) {
  return event?.title ?? "Sentry Event";
}

export function getTime(event: SentryEvent) {
  if (event?.timestamp) {
    return new Date(event?.timestamp * 1000);
  }

  return new Date();
}

export function getRelease(event: SentryEvent) {
  return event?.release;
}

export function getUser(event: SentryEvent) {
  return event?.user;
}

export function getFileLocation(event: SentryEvent) {
  return event?.location;
}

export function getStacktrace(event: SentryEvent) {
  return (
    event?.stacktrace || event?.exception?.values?.[0]?.stacktrace || {
        frames: [],
    }
  );
}

export function getErrorLocation(event: SentryEvent, maxLines = Infinity) {
  const stacktrace = getStacktrace(event);
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

export function getErrorCodeSnippet(event: SentryEvent) {
  const stacktrace = getStacktrace(event);
  const location = stacktrace?.frames?.reverse()?.[0];

  if (!location) {
    return event?.culprit ?? null;
  }
  
  return ` ${location.pre_context?.join("\n ") ?? ""}\n>${
    location.context_line
  }\n ${location.post_context?.join("\n ") ?? ""}`;
}

export function getMessage(event: SentryEvent) {
  return event?.message;
}
