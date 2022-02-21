// TODO: Maybe don't key in on this information, but likely track it: https://docs.sentry.io/api/ratelimits/

export function authorizedFetch() {
	// https://docs.sentry.io/product/integrations/integration-platform/#refreshing-tokens
	// Make request. If 401, call refresh token and try again
}

export function withPaginatedResults(fn) {
	// https://docs.sentry.io/api/pagination/
}

export function getOrganizations(installationId: string) {
	// https://docs.sentry.io/api/organizations/list-your-organizations/
}

export function getOrganizationMembers(slug: string) {
	// https://docs.sentry.io/api/organizations/list-an-organizations-users/
}

export function getProjects(slug: string) {
	// https://docs.sentry.io/api/organizations/list-an-organizations-projects/
}

export function getIssue(issueId: string) {
	// https://docs.sentry.io/api/events/retrieve-an-issue/
}

export function updateIssue(issueId: string, opts) {
	// https://docs.sentry.io/api/events/update-an-issue/
}
