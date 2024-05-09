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
	hidden: boolean;
	created_at: string;
	onSuccess?: () => void;
}

type PostUpdateData = {
	content: string;
	hidden: boolean;
};

const Post: React.FC<PostProps> = ({
	className,
	id,
	author,
	content,
	hidden,
	created_at,
	onSuccess,
}) => {
	const methods = useForm({
		defaultValues: {
			content,
			hidden,
		},
	});
	const { authApiCall }: AuthContext = useAuth();
	const { user }: UserContext = useUser();
	const [editEnabled, setEditEnabled] = useState(false);

	const handleSubmit = methods.handleSubmit((data) => {
		const thenCallback = (response: any) => {
			setEditEnabled(false);
			onSuccess && onSuccess();
		};

		const catchCallback = (error: any) => {
			// TODO mostrare errori validazione
			console.error("Edit post failed:", error);
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "PUT",
			data: data as PostUpdateData,
			thenCallback,
			catchCallback,
		};
		authApiCall(`/api/post/${id}/`, authApiCallParams);
	});

	return (
		<div className={className}>
			<Card>
				<Card.Header>{author}</Card.Header>
				<Card.Body>
					{user?.username === author ? (
						editEnabled ? (
							<FormProvider {...methods}>
								<form onSubmit={handleSubmit}>
									<Card.Text>
										<Input {...contentConfig} />
									</Card.Text>
									<div className="row justify-content-between">
										<div className="col text-start">
											<Input {...hiddenConfig} />
										</div>
										<div className="col">
											<p className="text-secondary">{created_at}</p>
										</div>
									</div>
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
						) : (
							<Card.Text>
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
								<div>
									<p>{content}</p>
									<div className="text-end">
										<p className="text-secondary">{created_at}</p>
									</div>
								</div>
							</Card.Text>
						)
					) : (
						<Card.Text>
							<div>
								<p>{content}</p>
								<div className="text-end">
									<p className="text-secondary">{created_at}</p>
								</div>
							</div>
						</Card.Text>
					)}
				</Card.Body>
			</Card>
		</div>
	);
};

export default Post;