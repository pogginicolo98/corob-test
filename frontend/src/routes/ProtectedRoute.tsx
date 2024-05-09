import { Navigate, Outlet } from "react-router-dom";
import { useAuth, AuthContext } from "@providers/AuthProvider";

export const ProtectedRoute: React.FC = () => {
	const { accessToken }: AuthContext = useAuth();

	// Check if the user is authenticated
	if (!accessToken) {
		// If not authenticated, redirect to the login page
		return <Navigate to="/login" />;
	}

	// If authenticated, render the child routes
	return <Outlet />;
};
