import { forwardRef } from "react";

const InputStop = forwardRef(function InputStop(
	{ textarea, id, label, ...props },
	ref
) {
	if (!textarea) {
		return (
			<>
				<label htmlFor={id} className="block font-bold pb-1">
					{label}
				</label>
				<input
					ref={ref}
					{...props}
					className="w-full rounded-lg bg-stone-100 border-2 border-zinc-300 px-2 py-1"
					name={id}
					id={id}
				/>
			</>
		);
	} else {
		return (
			<>
				<label htmlFor={id} className="block font-bold pb-1">
					{label}
				</label>
				<textarea
					ref={ref}
					{...props}
					className="w-full bg-stone-100 rounded-lg border-2 border-zinc-300 px-2 py-1"
					name={id}
					id={id}
				></textarea>
			</>
		);
	}
});

export default InputStop;
