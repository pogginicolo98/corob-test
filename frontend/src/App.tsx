import AuthProvider from "@providers/AuthProvider";
import UserProvider from "@providers/UserProvider";
import Navbar from "@components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "@pages/Home";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<>
					<Navbar />
					<div className="container" style={{ marginTop: "70px" }}>
						<Routes>
							<Route path="/" element={<Home />} />
						</Routes>
					</div>
				</>
			</UserProvider>
		</AuthProvider>
	);
}

export default App;
