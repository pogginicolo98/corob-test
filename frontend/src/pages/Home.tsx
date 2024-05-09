import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import LoginForm from "@components/LoginForm";
import SignUpForm from "@components/SignUpForm";
import Logout from "@components/Logout";

const Home: React.FC = () => {
	const { accessToken, authApiCall }: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();
	const [homeContent, setHomeContent] = useState("Home page as Guest");

	const handleRequestHome = () => {
		const thenCallback = (response: any) => {
			setHomeContent(response.data.message);
		};

		const catchCallback = (error: any) => {
			setHomeContent("Home page as Guest");
		};

		const requestApiCall: AuthAPICallParams = {
			method: "GET",
			thenCallback,
			catchCallback,
		};
		authApiCall("/api/home", requestApiCall);
	};

	return (
		<div className="text-center">
			<h1>Welcome to Twitter!</h1>
			<div className="text-center mt-3">
				<Button variant="warning" onClick={handleRequestHome}>
					Test request home
				</Button>
			</div>
			<div className="mt-4">{homeContent}</div>
		</div>
	);
};

export default Home;
