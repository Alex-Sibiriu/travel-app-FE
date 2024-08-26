export default function InputAuth({ id, label, ...props }) {
	return (
		<>
			<label htmlFor={id} className="w-24 inline-block text-start">
				{label}
			</label>
			<input
				{...props}
				name={id}
				id={id}
				className="bg-orange-300 px-2 py-1 w-3/5 max-w-72 text-white rounded-lg h-fit my-auto focus:outline-orange-600 active:bg-orange-300"
			/>
		</>
	);
}
