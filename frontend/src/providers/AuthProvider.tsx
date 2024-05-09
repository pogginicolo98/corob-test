import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";
import {
	JWTAccessToken,
	JWTRefreshToken,
	StoreTokens,
	ClearTokens,
} from "@utils/AxiosHelpers";
import { jwtApiCall, APICallParams } from "@utils/BackendHelpers";

interface AuthProviderProps {
	children: React.ReactElement;
}

export interface AuthAPICallParams extends APICallParams {
	injectRefresh?: boolean;
}

type AuthAPICall = (
	url: string,
	{
		method,
		data,
		contentType,
		injectRefresh,
		thenCallback,
		catchCallback,
		finallyCallback,
	}: AuthAPICallParams
) => void;

export interface AuthContext {
	accessToken: string | null;
	setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
	refreshToken: string | null;
	setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
	authApiCall: AuthAPICall;
}

// eslint-disable-next-line
const AuthContext = createContext({} as AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// State to hold the authentication and refresh tokens
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("accessToken")
	);
	const [refreshToken, setRefreshToken] = useState(
		localStorage.getItem("refreshToken")
	);

	const authApiCall = useCallback(
		(
			url: string,
			{
				method,
				data,
				contentType,
				injectRefresh,
				thenCallback,
				catchCallback,
				finallyCallback,
			}: AuthAPICallParams
		) => {
			const jwtAccessToken: JWTAccessToken = {
				name: "access",
				token: accessToken ? accessToken : undefined,
			};
			const jwtRefreshToken: JWTRefreshToken = {
				url: "/api/account/token/refresh/",
				data: { refresh: refreshToken },
			};
			const storeTokens: StoreTokens = (responseData: any) => {
				setAccessToken(responseData.access);
				setRefreshToken(responseData.refresh);
			};
			const cleanTokens: ClearTokens = () => {
				setAccessToken(null);
				setRefreshToken(null);
			};

			jwtApiCall(url, {
				method,
				data,
				contentType,
				jwtAccessToken,
				jwtRefreshToken,
				injectRefresh: injectRefresh ? injectRefresh : false,
				storeTokens,
				cleanTokens,
				thenCallback,
				catchCallback,
				finallyCallback,
			});
		},
		[accessToken, refreshToken]
	);

	useEffect((): void => {
		accessToken
			? localStorage.setItem("accessToken", accessToken)
			: localStorage.removeItem("accessToken");
		refreshToken
			? localStorage.setItem("refreshToken", refreshToken)
			: localStorage.removeItem("refreshToken");
	}, [accessToken, refreshToken]);

	// Memoized value of the authentication context
	const contextValue: AuthContext = useMemo(
		() => ({
			accessToken,
			setAccessToken,
			refreshToken,
			setRefreshToken,
			authApiCall,
		}),
		[accessToken, refreshToken, authApiCall]
	);

	// Provide the authentication context to the children components
	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => {
	return useContext(AuthContext);
};
