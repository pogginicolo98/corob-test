import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";
import { useUser, UserContext } from "@providers/UserProvider";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useEffect } from "react";

const Navbar = () => {
	const { user, setUser }: UserContext = useUser();
	const { accessToken, authApiCall }: AuthContext = useAuth();

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
				<BootstrapNavbar.Brand href="#home">
					Two Guys One Hike
				</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle />
				<BootstrapNavbar.Collapse className="justify-content-end">
					<BootstrapNavbar.Text>
						Signed in as: {user ? user.username : "Guest"}
					</BootstrapNavbar.Text>
				</BootstrapNavbar.Collapse>
			</Container>
		</BootstrapNavbar>
	);
};

export default Navbar;
