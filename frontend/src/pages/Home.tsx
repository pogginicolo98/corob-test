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
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleLogin = () => {
		navigate("/login/", { replace: true });
	};

	const handleLogout = () => {
		navigate("/logout/", { replace: true });
	};

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
			<h1>Welcome to Two Guys One Hike!</h1>
			<h2>{homeContent}</h2>
			<div className="row d-flex justify-content-between mt-4">
				<div className="col">
					<Button
						variant="primary"
						onClick={handleShow}
						disabled={accessToken ? true : false}
					>
						Login
					</Button>
				</div>
				<div className="col">
					<Logout disabled={!accessToken} />
				</div>
			</div>

			<div className="row justify-content-cnter mt-4">
				<div className="col mt-3">
					<Button variant="warning" onClick={handleRequestHome}>
						Test request home
					</Button>
				</div>
			</div>

			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>Login</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SignUpForm onSuccess={handleClose} onReset={handleClose} />
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default Home;
