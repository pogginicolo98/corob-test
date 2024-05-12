import AuthProvider from "@providers/AuthProvider";
import UserProvider from "@providers/UserProvider";
import Navbar from "@components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "@pages/Home";
import Profile from "@pages/Profile";
import Logout from "@pages/Logout";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<>
					<Navbar />
					<div className="container" style={{ marginTop: "70px" }}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="profile/" element={<Profile />} />
							<Route path="logout/" element={<Logout />} />
						</Routes>
					</div>
				</>
			</UserProvider>
		</AuthProvider>
	);
}

export default App;
