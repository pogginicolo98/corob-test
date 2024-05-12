import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import LoginForm from "@components/LoginForm";
import SignUpForm from "@components/SignUpForm";
import Post from "@components/Post";
import NewPostForm from "@components/NewPostForm";
import { AxiosResponse } from "axios";
import { nanoid } from "nanoid";

type PostDetail = {
	id: number;
	author: string;
	content: string;
	hidden: boolean;
	created_at: string;
};

type PostListResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: PostDetail[];
};

const Home: React.FC = () => {
	const { accessToken, authApiCall }: AuthContext = useAuth();
	const [postList, setPostList] = useState<PostDetail[]>([]);
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const [showNewPostForm, setShowNewPostForm] = useState(false);

	const handleShowLogin = () => setShowLogin(true);
	const handleShowSignUp = () => setShowSignUp(true);
	const handleClose = () => {
		setShowLogin(false);
		setShowSignUp(false);
	};

	const retrievePostlist = () => {
		const thenCallback = (response: AxiosResponse<any, any>) => {
			const responseData = response.data as PostListResponse;
			setPostList(responseData.results);
		};

		const catchCallback = (error: any) => {
			setPostList([]);
			console.error(error);
		};

		const requestApiCall: AuthAPICallParams = {
			method: "GET",
			thenCallback,
			catchCallback,
		};
		authApiCall("/api/post/public", requestApiCall);
	};

	useEffect(() => {
		if (accessToken) {
			retrievePostlist();
		} else {
			setPostList([]);
		}
	}, [accessToken]);

	return (
		<div className="text-center">
			<h1>Welcome to Twitter!</h1>
			<div className="mt-4">
				{accessToken ? (
					<>
						{postList?.length > 0 ? (
							<>
								<h3 className="mt-4 mb-3">Public posts</h3>
								{postList.map((post) => (
									<div key={nanoid()} className="row justify-content-center">
										<div className="col-5">
											<Post
												className="mb-3"
												id={post.id}
												author={post.author}
												content={post.content}
												created_at={post.created_at}
												editable={false}
											/>
										</div>
									</div>
								))}
							</>
						) : (
							<h2>Currently, there are no posts available</h2>
						)}
					</>
				) : (
					<div className="mt-3">
						<h3>You must be logged in to view posts</h3>
						<div className="row justify-content-center">
							<div className="col-12 col-md-5 col-lg-3">
								<div className="d-grid gap-2">
									<Button size="lg" variant="primary" onClick={handleShowLogin}>
										Login
									</Button>
									<Button
										size="lg"
										variant="outline-primary"
										onClick={handleShowSignUp}
									>
										Sign Up
									</Button>
								</div>
							</div>
						</div>
						<Modal show={showLogin} onHide={handleClose} centered>
							<Modal.Header closeButton>
								<Modal.Title>Login</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<LoginForm onSuccess={handleClose} onReset={handleClose} />
							</Modal.Body>
						</Modal>
						<Modal show={showSignUp} onHide={handleClose} centered>
							<Modal.Header closeButton>
								<Modal.Title>Sign Up</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<SignUpForm onSuccess={handleClose} onReset={handleClose} />
							</Modal.Body>
						</Modal>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
