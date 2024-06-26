import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@components/Input";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { hiddenConfig, contentConfig } from "@utils/InputFields";

interface PostProps {
	className?: string;
	onReset?: () => void;
	onSuccess?: () => void;
}

type NewPostData = {
	content: string;
	hidden: boolean;
};

const NewPostForm: React.FC<PostProps> = ({
	className,
	onReset,
	onSuccess,
}) => {
	const methods = useForm();
	const { authApiCall }: AuthContext = useAuth();
	const [genericError, setGenericError] = useState();

	const handleSubmit = methods.handleSubmit((data) => {
		setGenericError(undefined);

		const thenCallback = (response: any) => {
			onSuccess && onSuccess();
		};

		const catchCallback = (error: any) => {
			if (error.response?.status < 500 && error.response.data) {
				for (let field in error.response.data) {
					methods.setError(field, {
						types: Object.assign({}, error.response.data[field]),
					});
				}
			} else {
				error.response?.status >= 500
					? setGenericError(error.response.statusText)
					: setGenericError(error.message);
			}
			console.error("Sending post failed:", error);
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "POST",
			data: data as NewPostData,
			thenCallback,
			catchCallback,
		};
		authApiCall("/api/post/user/", authApiCallParams);
	});

	return (
		<div className={className}>
			<Card>
				<Card.Header>New post</Card.Header>
				<Card.Body>
					<FormProvider {...methods}>
						<form onSubmit={handleSubmit} onReset={onReset}>
							<Input {...contentConfig} />
							<div className="row justify-content-start my-3">
								<div className="col-auto text-start">
									<Input {...hiddenConfig} />
								</div>
							</div>
							{genericError && (
								<div className="text-center text-danger mt-3">
									<p>{genericError}</p>
								</div>
							)}
							<div className="row justify-content-between">
								<div className="col-auto">
									<Button type="submit" variant="primary">
										Send
									</Button>
								</div>
								<div className="col-auto">
									<Button type="reset" variant="outline-primary">
										Cancel
									</Button>
								</div>
							</div>
						</form>
					</FormProvider>
				</Card.Body>
			</Card>
		</div>
	);
};

export default NewPostForm;
