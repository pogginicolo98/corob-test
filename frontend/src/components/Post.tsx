import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { FaPen } from "react-icons/fa";
import { Input } from "@components/Input";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useUser, UserContext } from "@providers/UserProvider";
import { hiddenConfig, contentConfig } from "@utils/InputFields";

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
	const { user }: UserContext = useUser();
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

	const handleDelete = methods.handleSubmit((data) => {
		setGenericError(undefined);

		const thenCallback = (response: any) => {
			setEditEnabled(false);
			onSuccess && onSuccess();
		};

		const catchCallback = (error: any) => {
			error.response?.data?.detail
				? setGenericError(error.response.data.detail)
				: error.response?.status >= 500
				? setGenericError(error.response.statusText)
				: setGenericError(error.message);
			console.error("Delete post failed:", error);
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "DELETE",
			thenCallback,
			catchCallback,
		};
		authApiCall(`/api/post/user/${id}/`, authApiCallParams);
	});

	return (
		<div className={className}>
			<Card>
				<Card.Header>
					<div className="d-inline">
						<div className="row justify-content-between">
							<div className="col-auto">
								<span className="text-secondary">Created by: </span>
								{author === user?.username ? "you" : author}
							</div>
							{editable && (
								<div className="col-auto">
									<Button
										className="pb-1 pt-0"
										variant="secondary"
										size="sm"
										onClick={() => setEditEnabled(!editEnabled)}
									>
										<FaPen />
									</Button>
								</div>
							)}
						</div>
					</div>
				</Card.Header>
				{editable ? (
					editEnabled ? (
						<Card.Body>
							<FormProvider {...methods}>
								<form onSubmit={handleSubmit}>
									<Input {...contentConfig} />
									<div className="row justify-content-between my-3">
										<div className="col-auto text-start">
											<Input {...hiddenConfig} />
										</div>
										<div className="col-auto text-secondary">{created_at}</div>
									</div>
									{genericError && (
										<div className="text-center text-danger mt-3">
											<p>{genericError}</p>
										</div>
									)}
									<div className="row justify-content-between">
										<div className="col-auto">
											<Button type="submit" variant="outline-primary">
												Save
											</Button>
										</div>
										<div className="col-auto">
											<Button
												type="button"
												variant="outline-danger"
												onClick={handleDelete}
											>
												Delete
											</Button>
										</div>
									</div>
								</form>
							</FormProvider>
						</Card.Body>
					) : (
						<Card.Body>
							<Card.Text className="text-start">{content}</Card.Text>
							<Card.Text className="text-end text-secondary">
								{created_at}
							</Card.Text>
						</Card.Body>
					)
				) : (
					<Card.Body>
						<Card.Text className="text-start">{content}</Card.Text>
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
