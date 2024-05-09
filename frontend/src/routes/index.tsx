import {
	RouterProvider,
	createBrowserRouter,
	RouteObject,
} from "react-router-dom";
import { useAuth, AuthContext } from "@providers/AuthProvider";
import { ProtectedRoute } from "@routes/ProtectedRoute";
import Home from "@pages/Home";

const Routes: React.FC = () => {
	const { accessToken }: AuthContext = useAuth();

	// Define public routes accessible to all users
	const routesForPublic: RouteObject[] = [
		{
			path: "/",
			element: <Home />,
		},
		{
			path: "/service",
			element: <div>Service Page</div>,
		},
		{
			path: "/about-us",
			element: <div>About Us</div>,
		},
	];

	// Define routes accessible only to authenticated users
	const routesForAuthenticatedOnly: RouteObject[] = [
		{
			path: "/",
			element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
			children: [
				{
					path: "/profile",
					element: <div>User Profile</div>,
				},
				{
					path: "/logout",
					element: <div>Logout</div>,
				},
			],
		},
	];

	// Define routes accessible only to non-authenticated users
	const routesForNotAuthenticatedOnly: RouteObject[] = [
		{
			path: "/login",
			element: <div>Login</div>,
		},
	];

	// Combine and conditionally include routes based on authentication status
	const router = createBrowserRouter([
		...routesForPublic,
		...(accessToken
			? routesForAuthenticatedOnly
			: routesForNotAuthenticatedOnly),
	]);

	// Provide the router configuration using RouterProvider
	return <RouterProvider router={router} />;
};

export default Routes;
