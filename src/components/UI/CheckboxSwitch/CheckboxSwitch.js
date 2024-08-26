import classes from "./CheckboxSwitch.module.css";

export default function CheckboxSwitch({ label, inputId, ...props }) {
	return (
		<div className={classes.isVisited}>
			<strong className="text-lg">{label}</strong>
			<input {...props} type="checkbox" id={inputId} />
			<label htmlFor={inputId}>Toggle</label>
		</div>
	);
}
