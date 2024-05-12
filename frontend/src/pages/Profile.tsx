import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Post from "@components/Post";
import NewPostForm from "@components/NewPostForm";
import { AxiosResponse } from "axios";
import { nanoid } from "nanoid";
import { useUser, UserContext } from "@providers/UserProvider";

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

const Profile: React.FC = () => {
	const { accessToken, authApiCall }: AuthContext = useAuth();
	const { user }: UserContext = useUser();
	const [postList, setPostList] = useState<PostDetail[]>([]);
	const [showNewPostForm, setShowNewPostForm] = useState(false);

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
		authApiCall(`/api/post/user/${user?.id}`, requestApiCall);
	};

	useEffect(() => {
		if (accessToken && user) {
			retrievePostlist();
		} else {
			setPostList([]);
		}
	}, [accessToken, user]);

	return (
		<div className="text-center">
			<h1>Profile</h1>
			<div className="mt-4">
				<Button variant="success" onClick={() => setShowNewPostForm(true)}>
					New post
				</Button>
				{showNewPostForm && (
					<NewPostForm
						className="mt-3"
						onSuccess={() => {
							retrievePostlist();
							setShowNewPostForm(false);
						}}
						onReset={() => setShowNewPostForm(false)}
					/>
				)}
				{postList?.length > 0 ? (
					<>
						<h3 className="mt-4 mb-3">Your posts</h3>
						{postList.map((post) => (
							<div key={nanoid()} className="row justify-content-center">
								<div className="col-5">
									<Post
										className="mb-3"
										id={post.id}
										author={post.author}
										content={post.content}
										hidden={post.hidden}
										created_at={post.created_at}
										editable={true}
										onSuccess={retrievePostlist}
									/>
								</div>
							</div>
						))}
					</>
				) : (
					<h2 className="mt-4">You haven't created any posts yet</h2>
				)}
			</div>
		</div>
	);
};

export default Profile;
