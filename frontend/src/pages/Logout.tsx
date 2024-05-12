import { useNavigate } from "react-router-dom";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import LoginForm from "@components/LoginForm";
import SignUpForm from "@components/SignUpForm";

const Logout: React.FC = () => {
	const {
		refreshToken,
		setAccessToken,
		setRefreshToken,
		authApiCall,
	}: AuthContext = useAuth();
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const navigate = useNavigate();

	const handleShowLogin = () => setShowLogin(true);
	const handleShowSignUp = () => setShowSignUp(true);
	const handleClose = () => {
		setShowLogin(false);
		setShowSignUp(false);
	};

	useEffect(() => {
		const catchCallback = (error: any) => {
			console.error("Logout failed:", error);
		};

		const finallyCallback = () => {
			// Clean access and refresh tokens
			setAccessToken(null);
			setRefreshToken(null);
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "POST",
			data: { refresh: refreshToken },
			injectRefresh: true,
			catchCallback,
			finallyCallback,
		};
		authApiCall("/api/account/logout/", authApiCallParams);
	});

	return (
		<>
			<div className="text-center">
				<h1>You successfully logged out!</h1>
			</div>
			<div className="mt-5 text-center">
				<h4>Reister or log in again to access the homepage</h4>
				<div className="row justify-content-center mt-3">
					<div className="col-12 col-md-5 col-lg-3">
						<div className="d-grid gap-2">
							<Button size="lg" variant="primary" onClick={handleShowLogin}>
								Login
							</Button>
							<Button
								size="lg"
								variant="outline-primary"
								onClick={handleShowSignUp}
							>
								Sign Up
							</Button>
						</div>
					</div>
				</div>
				<Modal show={showLogin} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Login</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<LoginForm onSuccess={() => navigate("/")} onReset={handleClose} />
					</Modal.Body>
				</Modal>
				<Modal show={showSignUp} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Sign Up</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<SignUpForm onSuccess={() => navigate("/")} onReset={handleClose} />
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};

export default Logout;
