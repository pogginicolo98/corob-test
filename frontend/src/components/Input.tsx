import cn from "classnames";
import { findInputError, isFormInvalid } from "@utils/ValidationHelpers";
import {
	FieldErrors,
	FieldValues,
	RegisterOptions,
	useFormContext,
} from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";

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
		formState: { errors, isSubmitted },
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
			: setInputClassName(isSubmitted ? "is-valid" : "");
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
			{inputErrors.error !== undefined ? (
				<AnimatePresence mode="wait" initial={false}>
					{isInvalid && (
						<InputError
							message={inputErrors.error.message as string}
							key={inputErrors.error.message as string}
						/>
					)}
				</AnimatePresence>
			) : (
				<></>
			)}
		</div>
	);
};

interface InputError {
	message: string;
}

const framerError = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 10 },
	transition: { duration: 0.2 },
};

const InputError = ({ message }: InputError) => {
	return (
		<motion.p className="invalid-feedback" {...framerError}>
			{message}
		</motion.p>
	);
};
