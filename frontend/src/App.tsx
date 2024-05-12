import { Route, Routes } from "react-router-dom";
import Navbar from "@components/Navbar";
import AuthProvider from "@providers/AuthProvider";
import Home from "@pages/Home";
import Logout from "@pages/Logout";
import Profile from "@pages/Profile";
import UserProvider from "@providers/UserProvider";
import ProtectedRoute from "@routes/ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<>
					<Navbar />
					<div className="container" style={{ marginTop: "70px" }}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="logout/" element={<Logout />} />
							<Route
								path="profile/"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</div>
				</>
			</UserProvider>
		</AuthProvider>
	);
}

export default App;
