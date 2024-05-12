import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";

const ProtectedRoute = ({ children }: any) => {
	const { accessToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!accessToken) {
			navigate("/", { replace: true });
		}
	}, [navigate, accessToken]);

	return children;
};

export default ProtectedRoute;
