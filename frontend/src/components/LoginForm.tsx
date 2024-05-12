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
import { useState } from "react";

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
	const [genericError, setGenericError] = useState();

	const handleSubmit = methods.handleSubmit((data) => {
		setGenericError(undefined);

		const thenCallback = (response: any) => {
			// Store access and refresh tokens
			setAccessToken(response.data.access);
			setRefreshToken(response.data.refresh);
			onSuccess && onSuccess();
		};

		const catchCallback = (error: any) => {
			methods.resetField("password");
			if (error.response?.data?.detail) {
				methods.setError("password", {
					type: "server",
					message: error.response.data.detail,
				});
			} else {
				error.response?.status >= 500
					? setGenericError(error.response.statusText)
					: setGenericError(error.message);
			}

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
					{genericError && (
						<div className="text-center text-danger mt-3">
							<p>{genericError}</p>
						</div>
					)}
					<div className="d-grid gap-2 d-md-flex justify-content-md-between mt-5">
						<Button type="submit" variant="primary">
							Login
						</Button>
						<Button type="reset" variant="outline-primary">
							Cancel
						</Button>
					</div>
				</form>
			</FormProvider>
		</Container>
	);
};

export default LoginForm;
