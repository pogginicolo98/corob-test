import AuthProvider from "@providers/AuthProvider";
import UserProvider from "@providers/UserProvider";
import Navbar from "@components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "@pages/Home";

function App() {
	return (
		<div className="container mt-5">
			<AuthProvider>
				<UserProvider>
					<>
						<Navbar />
						<div className="container mt-4">
							<Routes>
								<Route path="/" element={<Home />} />
							</Routes>
						</div>
					</>
				</UserProvider>
			</AuthProvider>
		</div>
	);
}

export default App;
