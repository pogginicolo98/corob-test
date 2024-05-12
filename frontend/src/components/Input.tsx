import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import {
	FieldErrors,
	FieldValues,
	RegisterOptions,
	useFormContext,
} from "react-hook-form";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { findInputError, isFormInvalid } from "@utils/ValidationHelpers";

interface Input {
	name: string;
	label: string;
	type: HTMLInputTypeAttribute;
	role?: string;
	id: string;
	placeholder?: string;
	validation?: RegisterOptions<FieldValues, string>;
	multiline?: boolean;
}

export const Input: React.FC<Input> = ({
	name,
	label,
	type,
	role,
	id,
	placeholder,
	validation,
	multiline,
}) => {
	const {
		register,
		formState: { errors, isSubmitted, isSubmitSuccessful },
	} = useFormContext();
	const inputErrors: FieldErrors<FieldValues> = findInputError(errors, name);
	const isInvalid: boolean = isFormInvalid(inputErrors);
	const [inputClassName, setInputClassName] = useState("");
	const baseDivCss =
		role && type === "checkbox"
			? "form-check form-switch"
			: type === "checkbox"
			? "form-check"
			: "";
	const baseLabelCss = type === "checkbox" ? "form-check-label" : "form-label";
	const baseInputCss =
		type === "checkbox" ? "form-check-input" : "form-control";

	useEffect((): void => {
		isInvalid
			? setInputClassName("is-invalid")
			: setInputClassName(isSubmitted && !isSubmitSuccessful ? "is-valid" : "");
	}, [inputErrors, isSubmitted]);

	return (
		<div className={baseDivCss}>
			<label htmlFor={id} className={baseLabelCss}>
				{label}
			</label>
			{multiline ? (
				<textarea
					id={id}
					className={cn(baseInputCss, inputClassName)}
					style={{ minHeight: "10rem", maxHeight: "20rem", resize: "vertical" }}
					placeholder={placeholder}
					{...register(name, validation)}
				/>
			) : (
				<input
					id={id}
					type={type}
					role={role}
					className={cn(baseInputCss, inputClassName)}
					placeholder={placeholder}
					{...register(name, validation)}
				/>
			)}
			{inputErrors.error?.types !== undefined && isInvalid ? (
				<AnimatePresence mode="wait" initial={false}>
					<InputErrors
						messages={Object.values(inputErrors.error.types) as string[]}
						key={nanoid()}
					/>
				</AnimatePresence>
			) : inputErrors.error !== undefined && isInvalid ? (
				<InputErrors
					messages={Object.values([inputErrors.error.message]) as string[]}
					key={nanoid()}
				/>
			) : (
				<></>
			)}
		</div>
	);
};

interface InputErrors {
	messages: string[];
}

const framerError = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 10 },
	transition: { duration: 0.2 },
};

const InputErrors = ({ messages }: InputErrors) => {
	return messages.length > 1 ? (
		<motion.ul className="invalid-feedback" {...framerError}>
			{messages.map((message) => (
				<li>{message}</li>
			))}
		</motion.ul>
	) : (
		<motion.p className="invalid-feedback" {...framerError}>
			{messages[0]}
		</motion.p>
	);
};
