import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { apiCall } from "@utils/BackendHelpers";
import { Input } from "@components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { usernameConfig, passwordConfig } from "@utils/InputFields";
import { Container, Button } from "react-bootstrap";

interface Credentials {
	username: string;
	password: string;
}

interface LoginFormProps {
	onSuccess?: () => void;
	onReset?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onReset }) => {
	const methods = useForm();
	const { setAccessToken, setRefreshToken }: AuthContext = useAuth();

	const handleSubmit = methods.handleSubmit((data) => {
		const thenCallback = (response: any) => {
			// Store access and refresh tokens
			setAccessToken(response.data.access);
			setRefreshToken(response.data.refresh);
			onSuccess && onSuccess();
		};

		const catchCallback = (error: any) => {
			methods.resetField("password");
			methods.setError("password", {
				type: "server",
				message: error.response?.data?.detail
					? error.response?.data.detail
					: error.message,
			});
			console.error("Login failed:", error);
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "POST",
			data: data as Credentials,
			thenCallback,
			catchCallback,
		};
		apiCall("/api/account/token/", authApiCallParams);
	});

	return (
		<Container fluid>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit} onReset={onReset}>
					<div className="row">
						<div className="col-12">
							<Input {...usernameConfig} />
						</div>
						<div className="col-12 mt-3">
							<Input {...passwordConfig} />
						</div>
					</div>
					<div className="d-grid gap-2 d-md-flex justify-content-md-between mt-5">
						<Button type="submit" variant="primary">
							Login
						</Button>
						<Button type="reset" variant="primary">
							Cancel
						</Button>
					</div>
				</form>
			</FormProvider>
		</Container>
	);
};

export default LoginForm;
