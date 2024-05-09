import AuthProvider from "@providers/AuthProvider";
import UserProvider from "@providers/UserProvider";
import Navbar from "@components/Navbar";
import Routes from "./routes";

function App() {
	return (
		<div className="container mt-5">
			<AuthProvider>
				<UserProvider>
					<>
						<Navbar />
						<Routes />
					</>
				</UserProvider>
			</AuthProvider>
		</div>
	);
}

export default App;
