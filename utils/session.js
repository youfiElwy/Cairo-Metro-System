// module.exports = {
// 	getSessionToken(req) {
// 		if (!req.headers.cookie) {
// 			return null;
// 		}
// 		const cookies = req.headers.cookie
// 			.split(';')
// 			.map(function (cookie) {
// 				return cookie.trim();
// 			})
// 			.filter(function (cookie) {
// 				return cookie.includes('session_token');
// 			})
// 			.join('');

// 		const sessionToken = cookies.slice('session_token='.length);
// 		if (!sessionToken) {
// 			return null;
// 		}
// 		return sessionToken;
// 	},
// };
module.exports = {
	getSessionToken(req) {
		if (!req.headers.token && !req.headers.cookie) {
			return null;
		}
		if (req.headers.token !== undefined) {
			console.log(req.headers.token);
			const cookies = req.headers.token
				.split(';')
				.map(function (cookie) {
					return cookie.trim();
				})
				.filter(function (cookie) {
					return cookie.includes('session_token');
				})
				.join('');
			const sessionToken = cookies.slice('session_token='.length);
			if (!sessionToken) {
				return null;
			}
			return sessionToken;
		}
		else {
			console.log(req.headers.cookie);
			const cookies2 = req.headers.cookie
				.split(';')
				.map(function (cookie) {
					return cookie.trim();
				})
				.filter(function (cookie) {
					return cookie.includes('session_token');
				})
				.join('');


			const sessionToken2 = cookies2.slice('session_token='.length);
			if (!sessionToken2) {
				return null;
			}
			if (!sessionToken2) {
				return null;
			}
			return sessionToken2;
		}
	},
};


