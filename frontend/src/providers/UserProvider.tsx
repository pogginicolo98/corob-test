import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface UserProviderProps {
	children: React.ReactElement;
}

interface User {
	name: string;
	username: string;
	email: string;
}

export interface UserContext {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

// eslint-disable-next-line
const UserContext = createContext({} as UserContext);

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	// State to hold the user information
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user") as string)
	);

	useEffect((): void => {
		user
			? localStorage.setItem("user", JSON.stringify(user))
			: localStorage.removeItem("user");
	}, [user]);

	// Memoized value of the authentication context
	const contextValue: UserContext = useMemo(
		() => ({
			user,
			setUser,
		}),
		[user]
	);

	// Provide the authentication context to the children components
	return (
		<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
	);
};

export default UserProvider;

export const useUser = () => {
	return useContext(UserContext);
};
