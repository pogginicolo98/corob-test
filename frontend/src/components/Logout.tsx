import { useNavigate, NavigateFunction } from "react-router-dom";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { Button } from "react-bootstrap";

interface LogoutProps {
	disabled?: boolean;
}

const Logout: React.FC<LogoutProps> = ({ disabled }: LogoutProps) => {
	const {
		refreshToken,
		setAccessToken,
		setRefreshToken,
		authApiCall,
	}: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();

	const handleLogout = (event: React.FormEvent) => {
		const catchCallback = (error: any) => {
			console.error("Logout failed:", error);
		};

		const finallyCallback = () => {
			// Clean access and refresh tokens
			setAccessToken(null);
			setRefreshToken(null);
			navigate("/", { replace: true });
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "POST",
			data: { refresh: refreshToken },
			injectRefresh: true,
			catchCallback,
			finallyCallback,
		};
		authApiCall("/api/account/logout/", authApiCallParams);
	};

	return (
		<div>
			<Button variant="primary" onClick={handleLogout} disabled={disabled}>
				Logout
			</Button>
		</div>
	);
};

export default Logout;
