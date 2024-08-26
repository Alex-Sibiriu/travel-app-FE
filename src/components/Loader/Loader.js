import classes from "./Loader.module.css";

export default function Loader({ small = false }) {
	let boxClasses = "flex h-[50vh] flex-col justify-center";

	if (small === true) {
		boxClasses = "flex h-[60px] flex-col justify-center";
	}

	return (
		<div className={boxClasses}>
			<div className={classes.loading}>
				{!small && <h2 className="text-white">Caricamento...</h2>}
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
	);
}
