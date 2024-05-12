import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { Input } from "@components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { hiddenConfig, contentConfig } from "@utils/InputFields";
import { Button, Card } from "react-bootstrap";
import { UserContext, useUser } from "@providers/UserProvider";
import { useState } from "react";

interface PostProps {
	className: string;
	id: number;
	author: string;
	content: string;
	hidden?: boolean;
	created_at: string;
	editable: boolean;
	onSuccess?: () => void;
}

type PostUpdateData = {
	content: string;
	hidden: boolean;
};

type PostFieldNames = "content" | "hidden";

const Post: React.FC<PostProps> = ({
	className,
	id,
	author,
	content,
	hidden,
	created_at,
	editable,
	onSuccess,
}) => {
	const methods = useForm(
		editable
			? {
					defaultValues: {
						content,
						hidden,
					},
			  }
			: undefined
	);
	const { authApiCall }: AuthContext = useAuth();
	const [genericError, setGenericError] = useState();
	const [editEnabled, setEditEnabled] = useState(false);

	const handleSubmit = methods.handleSubmit((data) => {
		setGenericError(undefined);

		const thenCallback = (response: any) => {
			setEditEnabled(false);
			onSuccess && onSuccess();
		};

		const catchCallback = (error: any) => {
			if (error.response?.status < 500 && error.response.data) {
				for (let field in error.response.data) {
					methods.setError(field as PostFieldNames, {
						types: Object.assign({}, error.response.data[field]),
					});
				}
			} else {
				error.response?.status >= 500
					? setGenericError(error.response.statusText)
					: setGenericError(error.message);
			}
			console.error("Edit post failed:", error);
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "PUT",
			data: data as PostUpdateData,
			thenCallback,
			catchCallback,
		};
		authApiCall(`/api/post/user/${id}/`, authApiCallParams);
	});

	return (
		<div className={className}>
			<Card>
				<Card.Header>{author}</Card.Header>
				{editable ? (
					editEnabled ? (
						<Card.Body>
							<FormProvider {...methods}>
								<form onSubmit={handleSubmit}>
									<Input {...contentConfig} />
									<div className="row justify-content-between">
										<div className="col text-start">
											<Input {...hiddenConfig} />
										</div>
										<div className="col text-secondary">{created_at}</div>
									</div>
									{genericError && (
										<div className="text-center text-danger mt-3">
											<p>{genericError}</p>
										</div>
									)}
									<div className="row justify-content-between">
										<div className="col">
											<Button type="submit" variant="primary">
												Save
											</Button>
										</div>
										<div className="col">
											<Button
												type="button"
												variant="primary"
												onClick={() => setEditEnabled(false)}
											>
												Cancel
											</Button>
										</div>
									</div>
								</form>
							</FormProvider>
						</Card.Body>
					) : (
						<Card.Body>
							<div className="row justify-content-end">
								<div className="col">
									<Button
										className="mb-2"
										type="button"
										variant="primary"
										onClick={() => setEditEnabled(true)}
									>
										Edit
									</Button>
								</div>
							</div>
							<Card.Text>{content}</Card.Text>
							<Card.Text className="text-end text-secondary">
								{created_at}
							</Card.Text>
						</Card.Body>
					)
				) : (
					<Card.Body>
						<Card.Text>{content}</Card.Text>
						<Card.Text className="text-end text-secondary">
							{created_at}
						</Card.Text>
					</Card.Body>
				)}
			</Card>
		</div>
	);
};

export default Post;
