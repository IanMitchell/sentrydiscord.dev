// import database from "../core/database";

// export async function getRefreshToken(installId: string, expiredToken: string) {
// 	const request = await fetch(
// 		`https://sentry.io/api/0/sentry-app-installations/${installId}/authorizations/`,
// 		{
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				grant_type: "refresh_token",
// 				refresh_token: expiredToken,
// 				client_id: process.env.SENTRY_CLIENT_ID,
// 				client_secret: process.env.SENTRY_CLIENT_SECRET,
// 			}),
// 		}
// 	);

// 	const data = await request.json();
// 	const { token, refreshToken }: { token: string; refreshToken: string } = data;

// 	await database.install.update({
// 		where: {
// 			id: installId,
// 		},
// 		data: {
// 			token,
// 			refreshToken,
// 		},
// 	});

// 	return token;
// }
