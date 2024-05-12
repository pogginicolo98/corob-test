import { useNavigate } from "react-router-dom";
import {
	Navbar as BootstrapNavbar,
	Container,
	Offcanvas,
	Nav,
	NavDropdown,
} from "react-bootstrap";
import { useUser, UserContext } from "@providers/UserProvider";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { ReactComponent as LogoImg } from "@img/logo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
	const { user, setUser }: UserContext = useUser();
	const { accessToken, authApiCall }: AuthContext = useAuth();
	const navigate = useNavigate();
	const [showOffcanvas, setShowOffcanvas] = useState(false);

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
		<BootstrapNavbar fixed="top" expand="md" className="bg-body-tertiary px-3">
			<Container fluid>
				<BootstrapNavbar.Brand href="/">
					<LogoImg
						height={30}
						width={30}
						className="d-inline-block align-top"
					/>{" "}
					Twitter
				</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle
					aria-controls={"offcanvasNavbar"}
					onClick={() => setShowOffcanvas(true)}
				/>
				<BootstrapNavbar.Offcanvas
					id={"offcanvasNavbar"}
					aria-labelledby={"offcanvasNavbarLabel"}
					placement="end"
					show={showOffcanvas}
				>
					<Offcanvas.Header closeButton onHide={() => setShowOffcanvas(false)}>
						<Offcanvas.Title id={"offcanvasNavbarLabel"}>
							<LogoImg
								height={30}
								width={30}
								className="d-inline-block align-top"
							/>{" "}
							Twitter
						</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body className="d-none d-md-block">
						<Nav className="justify-content-end flex-grow-1 pe-3">
							{user && (
								<>
									<p className="my-auto">Signed in as:</p>
									<NavDropdown
										title={user.username}
										id={"offcanvasNavbarDropdown"}
										align="end"
										className="d-md-node"
									>
										<NavDropdown.Item onClick={() => navigate("/")}>
											Homepage
										</NavDropdown.Item>
										<NavDropdown.Divider />
										<NavDropdown.Item onClick={() => navigate("profile/")}>
											Profile
										</NavDropdown.Item>
										<NavDropdown.Item onClick={() => navigate("logout/")}>
											Logout
										</NavDropdown.Item>
									</NavDropdown>
								</>
							)}
						</Nav>
					</Offcanvas.Body>
					<Offcanvas.Body className="d-block d-md-none">
						<Nav className="justify-content-end flex-grow-1 pe-3">
							{user && (
								<>
									<p className="text-center">Signed in as: {user.username}</p>
									<Nav.Item onClick={() => setShowOffcanvas(false)}>
										<Link className="d-flex" to="/">
											Homepage
										</Link>
									</Nav.Item>
									<hr />
									<Nav.Item onClick={() => setShowOffcanvas(false)}>
										<Link className="d-flex" to="profile/">
											Profile
										</Link>
									</Nav.Item>
									<Nav.Item
										onClick={() => setShowOffcanvas(false)}
										className="mt-2"
									>
										<Link className="d-flex" to="logout/">
											Logout
										</Link>
									</Nav.Item>
								</>
							)}
						</Nav>
					</Offcanvas.Body>
				</BootstrapNavbar.Offcanvas>
			</Container>
		</BootstrapNavbar>
	);
};

export default Navbar;
