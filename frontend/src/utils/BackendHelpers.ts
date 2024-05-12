import axios, { Method } from "axios";
import {
	createJWTAxiosInstance,
	JWTAccessToken,
	JWTRefreshToken,
	StoreTokens,
	ClearTokens,
} from "@utils/AxiosHelpers";

export type CallbackWithParam = (param: any) => void;
export type CallbackWithoutParam = () => void;

export interface APICallParams {
	method?: Method;
	data?: object;
	contentType?: string;
	thenCallback?: CallbackWithParam;
	catchCallback?: CallbackWithParam;
	finallyCallback?: CallbackWithoutParam;
}

export async function apiCall(
	url: string,
	{
		method,
		data,
		contentType,
		thenCallback,
		catchCallback,
		finallyCallback,
	}: APICallParams
): Promise<void> {
	// Create simple Axios instance
	const jwtAxiosInstance = axios.create({
		baseURL: process.env.REACT_APP_BACKEND_HOST ?? "",
		timeout: Number(process.env.REACT_APP_AXIOS_TIMEOUT) ?? 1000,
	});

	// Create HTTP request with provided parameters
	await jwtAxiosInstance
		.request({
			url,
			method,
			data,
			headers: {
				"Content-Type": contentType ? contentType : "application/json",
			},
		})
		.then((response) => {
			if (thenCallback) {
				thenCallback(response);
			}
		})
		.catch((error) => {
			if (catchCallback) {
				catchCallback(error);
			}
		})
		.finally(() => {
			if (finallyCallback) {
				finallyCallback();
			}
		});
}

export interface JWTAPICallParams extends APICallParams {
	jwtAccessToken: JWTAccessToken;
	jwtRefreshToken: JWTRefreshToken;
	injectRefresh: boolean;
	storeTokens: StoreTokens;
	cleanTokens: ClearTokens;
}

export async function jwtApiCall(
	url: string,
	{
		method,
		data,
		contentType,
		jwtAccessToken,
		jwtRefreshToken,
		injectRefresh,
		storeTokens,
		cleanTokens,
		thenCallback,
		catchCallback,
		finallyCallback,
	}: JWTAPICallParams
): Promise<void> {
	// Create Axios instance with JWT refresh handler
	const baseUrl = process.env.REACT_APP_BACKEND_HOST ?? "";
	const jwtAxiosInstance = createJWTAxiosInstance(
		baseUrl,
		injectRefresh,
		jwtAccessToken,
		jwtRefreshToken,
		storeTokens,
		cleanTokens
	);

	// Create HTTP request with provided parameters
	await jwtAxiosInstance
		.request({
			url,
			method,
			data,
			headers: {
				"Content-Type": contentType ? contentType : "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			if (thenCallback) {
				thenCallback(response);
			}
		})
		.catch((error) => {
			if (catchCallback) {
				catchCallback(error);
			}
		})
		.finally(() => {
			if (finallyCallback) {
				finallyCallback();
			}
		});
}
