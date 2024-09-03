export default function ColoredBtn({ color, disabled, children, ...props }) {
	let baseClasses =
		"px-5 py-3 font-bold rounded-md text-lg transition-all border-2";
	let bgClass,
		borderClass,
		textClass,
		hoverBgClass,
		hoverTextClass,
		hoverBorderClass;

	if (color === "orange") {
		bgClass = "bg-orange-500";
		borderClass = "border-gray-800";
		textClass = "text-gray-800";
		hoverBgClass = "hover:bg-orange-500";
		hoverBorderClass = "hover:border-orange-50";
		hoverTextClass = "hover:text-orange-50";
	} else if (color === "red") {
		bgClass = "bg-red-100";
		borderClass = "border-red-700";
		textClass = "text-red-700";
		hoverBgClass = "hover:bg-red-800";
		hoverBorderClass = "hover:border-white";
		hoverTextClass = "hover:text-red-100";
	} else if (color === "transparent") {
		bgClass = "bg-transparent";
		borderClass = "border-orange-300";
		textClass = "";
		hoverBgClass = "bg-transaprent";
		hoverBorderClass = "hover:border-orange-200";
		hoverTextClass = "hover:text-white";
	} else {
		bgClass = "bg-gray-300";
		borderClass = "border-gray-400";
		textClass = "text-gray-500";
		hoverBgClass = "hover:bg-gray-400";
		hoverBorderClass = "hover:border-gray-500";
		hoverTextClass = "hover:text-gray-100";
	}

	let classes = `${baseClasses} ${bgClass} ${borderClass} ${textClass} ${
		disabled ? "" : `${hoverBgClass} ${hoverTextClass} ${hoverBorderClass}`
	}`;

	return (
		<button {...props} disabled={disabled} className={classes}>
			{children}
		</button>
	);
}
