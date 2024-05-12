import axios from "axios";

export type JWTAccessToken = {
	name: string;
	token?: string;
};
export type JWTRefreshToken = {
	url: string;
	data: object;
};
export type StoreTokens = (data: any) => void;
export type ClearTokens = () => void;

export function createJWTAxiosInstance(
	baseUrl: string,
	injectRefresh: boolean,
	accessToken: JWTAccessToken,
	refreshToken?: JWTRefreshToken,
	storeTokens?: StoreTokens,
	clearTokens?: ClearTokens
) {
	const axios_instance = axios.create({
		baseURL: baseUrl,
		timeout: 5000,
		headers: accessToken.token
			? { Authorization: "Bearer " + accessToken.token }
			: undefined,
	});

	const interceptor = axios_instance.interceptors.response.use(
		(response) => response,
		(error) => {
			// Reject promise if usual error or refresh data are not provided
			if (error.response?.status !== 401 || !refreshToken) {
				return Promise.reject(error);
			}

			/*
			 * When response code is 401, try to refresh the token.
			 * Eject the interceptor so it doesn't loop in case
			 * token refresh causes the 401 response.
			 */
			axios_instance.interceptors.response.eject(interceptor);
			return axios_instance
				.post(refreshToken.url, refreshToken.data, {
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				})
				.then((response) => {
					/*
					 * Save updated tokens.
					 * Passing data instead of single tokens because
					 * some JWT protocol does not provide both access
					 * and refresh after refresh request.
					 */
					if (storeTokens) {
						storeTokens(response.data);
					}

					/*
					 * Retry the initial call, but with the updated token in the headers.
					 * Injects the refresh token into the data, useful in case the
					 * original call includes the refresh token as in the case of logout.
					 * Resolves the promise if successful.
					 */
					error.response.config.headers["Authorization"] =
						"Bearer " + response.data[accessToken.name];
					if (injectRefresh) {
						const refreshKey = Object.keys(refreshToken.data)[0];
						let originalData = JSON.parse(error.response.config.data);
						originalData[refreshKey] = response.data[refreshKey];
						const updatedlData = JSON.stringify(originalData);
						error.response.config.data = updatedlData;
					}
					return axios_instance(error.response.config);
				})
				.catch((retry_error) => {
					// Retry failed, clean up and reject the promise
					if (clearTokens) {
						clearTokens();
					}
					return Promise.reject(retry_error);
				});
		}
	);

	return axios_instance;
}
