export const usernameConfig = {
	name: "username",
	label: "Username",
	type: "text",
	id: "username",
	placeholder: "Username ...",
	validation: {
		required: {
			value: true,
			message: "Username is required",
		},
		maxLength: {
			value: 30,
			message: "30 characters max",
		},
	},
};

export const passwordConfig = {
	name: "password",
	label: "Password",
	type: "password",
	id: "password",
	placeholder: "Type password ...",
	validation: {
		required: {
			value: true,
			message: "Password is required",
		},
		minLength: {
			value: 6,
			message: "min 8 characters",
		},
	},
};

export const password2Config = {
	name: "password2",
	label: "Repeat password",
	type: "password",
	id: "password2",
	placeholder: "Type password ...",
	validation: {
		required: {
			value: true,
			message: "Password is required",
		},
		minLength: {
			value: 6,
			message: "min 8 characters",
		},
	},
};

export const emailConfig = {
	name: "email",
	label: "Email address",
	type: "email",
	id: "email",
	placeholder: "Write a random email address",
	validation: {
		required: {
			value: true,
			message: "Email is required",
		},
		pattern: {
			value:
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			message: "not valid",
		},
	},
};

export const firstNameConfig = {
	name: "first_name",
	label: "First name",
	type: "text",
	id: "first_name",
	placeholder: "Write your name ...",
	validation: {
		required: {
			value: true,
			message: "First name is required",
		},
		maxLength: {
			value: 30,
			message: "30 characters max",
		},
	},
};

export const lastNameConfig = {
	name: "last_name",
	label: "Last name",
	type: "text",
	id: "last_name",
	placeholder: "Write your last name ...",
	validation: {
		required: {
			value: true,
			message: "Last name is required",
		},
		maxLength: {
			value: 30,
			message: "30 characters max",
		},
	},
};
