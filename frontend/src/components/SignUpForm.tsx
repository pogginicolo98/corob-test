import { useAuth, AuthContext } from "@providers/AuthProvider";
import { apiCall, APICallParams } from "@utils/BackendHelpers";
import { Input } from "@components/Input";
import { FormProvider, useForm } from "react-hook-form";
import {
	usernameConfig,
	passwordConfig,
	password2Config,
	emailConfig,
	firstNameConfig,
	lastNameConfig,
} from "@utils/InputFields";
import { Container, Button } from "react-bootstrap";

interface RegisterData {
	username: string;
	password: string;
	password2: string;
	email: string;
	first_name: string;
	last_name: string;
}

interface Credentials {
	username: string;
	password: string;
}

interface SignUpFormProps {
	onSuccess?: () => void;
	onReset?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onReset }) => {
	const methods = useForm();
	const { setAccessToken, setRefreshToken }: AuthContext = useAuth();

	const loginApiCall = (data: Credentials) => {
		const thenCallback = (response: any) => {
			// Store access and refresh tokens
			setAccessToken(response.data.access);
			setRefreshToken(response.data.refresh);
			onSuccess && onSuccess();
		};

		const catchCallback = (error: any) => {
			console.error("Login after sign up failed:", error);
		};

		const apiCallParams: APICallParams = {
			method: "POST",
			data: data,
			thenCallback,
			catchCallback,
		};
		apiCall("/api/account/token/", apiCallParams);
	};

	const handleSubmit = methods.handleSubmit((data) => {
		const thenCallback = (response: any) => {
			loginApiCall({ username: data.username, password: data.password });
		};

		const catchCallback = (error: any) => {
			//TODO add validation error for each field
			// methods.resetField("password");
			// methods.setError("password", {
			// 	type: "server",
			// 	message: error.response?.data?.detail
			// 		? error.response?.data.detail
			// 		: error.message,
			// });
			console.error("Sign up failed:", error);
		};

		const apiCallParams: APICallParams = {
			method: "POST",
			data: data as RegisterData,
			thenCallback,
			catchCallback,
		};
		apiCall("/api/account/register/", apiCallParams);
	});

	return (
		<Container fluid>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit} onReset={onReset}>
					<div className="row">
						<div className="col-6">
							<Input {...usernameConfig} />
						</div>
						<div className="col-6">
							<Input {...emailConfig} />
						</div>
					</div>
					<div className="row mt-3">
						<div className="col-6">
							<Input {...passwordConfig} />
						</div>
						<div className="col-6">
							<Input {...password2Config} />
						</div>
					</div>
					<div className="row mt-3">
						<div className="col-6">
							<Input {...firstNameConfig} />
						</div>
						<div className="col-6">
							<Input {...lastNameConfig} />
						</div>
					</div>
					<div className="d-grid gap-2 d-md-flex justify-content-md-between mt-5">
						<Button type="submit" variant="primary">
							Register
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

export default SignUpForm;
