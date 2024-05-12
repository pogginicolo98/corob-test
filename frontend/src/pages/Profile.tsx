import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AxiosResponse } from "axios";
import { nanoid } from "nanoid";
import NewPostForm from "@components/NewPostForm";
import Post from "@components/Post";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
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

const Profile: React.FC<{}> = () => {
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
		authApiCall(`/api/post/user/`, requestApiCall);
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
			<div className="mt-5">
				{!showNewPostForm ? (
					<Button variant="success" onClick={() => setShowNewPostForm(true)}>
						New post
					</Button>
				) : (
					<div className="row justify-content-center">
						<div className="col-12 col-md-9 col-lg-7 col-xl-6">
							<NewPostForm
								className="mt-3"
								onSuccess={() => {
									retrievePostlist();
									setShowNewPostForm(false);
								}}
								onReset={() => setShowNewPostForm(false)}
							/>
						</div>
					</div>
				)}
				{postList?.length > 0 ? (
					<>
						<h4 className="mt-4 mb-3">Your posts</h4>
						{postList.map((post) => (
							<div key={nanoid()} className="row justify-content-center">
								<div className="col-12 col-md-8 col-lg-6 col-xl-5">
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
					<h4 className="mt-4">You haven't created any posts yet</h4>
				)}
			</div>
		</div>
	);
};

export default Profile;
