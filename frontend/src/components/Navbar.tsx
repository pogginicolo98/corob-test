import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";
import { useUser, UserContext } from "@providers/UserProvider";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useEffect } from "react";
import LoginForm from "@components/LoginForm";
import SignUpForm from "@components/SignUpForm";
import Logout from "@components/Logout";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

const Navbar = () => {
	const { user, setUser }: UserContext = useUser();
	const { accessToken, authApiCall }: AuthContext = useAuth();
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);

	const handleShowLogin = () => setShowLogin(true);
	const handleShowSignUp = () => setShowSignUp(true);
	const handleClose = () => {
		setShowLogin(false);
		setShowSignUp(false);
	};

	useEffect((): void => {
		if (accessToken) {
			const thenCallback = (response: any) => {
				setUser(response.data);
			};

			const catchCallback = (error: any) => {
				console.error("Retrieve user data failed:", error);
			};

			const authApiCallParams: AuthAPICallParams = {
				method: "GET",
				thenCallback,
				catchCallback,
			};
			authApiCall("/api/account/user/", authApiCallParams);
		} else {
			setUser(null);
		}
	}, [accessToken]);

	return (
		<BootstrapNavbar className="bg-body-tertiary">
			<Container>
				<BootstrapNavbar.Brand href="#home">Twitter</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle />
				<BootstrapNavbar.Collapse className="justify-content-end">
					<BootstrapNavbar.Text className="mx-2">
						Signed in as: {user ? user.username : "Guest"}
					</BootstrapNavbar.Text>
					{!accessToken ? (
						<>
							<Button
								className="mx-2"
								variant="primary"
								onClick={handleShowLogin}
							>
								Login
							</Button>
							<Button
								className="mx-2"
								variant="primary"
								onClick={handleShowSignUp}
							>
								Sign Up
							</Button>
							<Modal show={showLogin} onHide={handleClose} centered>
								<Modal.Header closeButton>
									<Modal.Title>Login</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<LoginForm onSuccess={handleClose} onReset={handleClose} />
								</Modal.Body>
							</Modal>
							<Modal show={showSignUp} onHide={handleClose} centered>
								<Modal.Header closeButton>
									<Modal.Title>Sign Up</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<SignUpForm onSuccess={handleClose} onReset={handleClose} />
								</Modal.Body>
							</Modal>
						</>
					) : (
						<Logout />
					)}
				</BootstrapNavbar.Collapse>
			</Container>
		</BootstrapNavbar>
	);
};

export default Navbar;
