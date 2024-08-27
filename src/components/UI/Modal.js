import { forwardRef, useState, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import ColoredBtn from "./ColoredBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Modal = forwardRef(function Modal({ title, fn, image }, ref) {
	const [isOpen, setIsOpen] = useState(false);
	const isSubmitting = useSelector((state) => state.travel.isSubmitting);

	useImperativeHandle(ref, () => ({
		open: () => setIsOpen(true),
		close: () => setIsOpen(false),
	}));

	if (!isOpen) return null;

	if (!image) {
		return createPortal(
			<div className="fixed inset-0 z-40 flex items-center justify-center">
				<div className="absolute h-screen inset-0 bg-black bg-opacity-50"></div>

				<dialog
					open
					className="relative w-11/12 max-w-[800px] p-4 rounded-2xl border-8 border-orange-600 bg-white"
				>
					<h2 className="pb-8 text-center">{title}</h2>
					<FontAwesomeIcon
						icon={faXmark}
						onClick={isSubmitting ? null : () => setIsOpen(false)}
						className="absolute top-3 right-4 text-2xl cursor-pointer"
					/>
					<div className="flex justify-center gap-4">
						<ColoredBtn
							onClick={() => setIsOpen(false)}
							disabled={isSubmitting}
						>
							Annulla
						</ColoredBtn>
						<ColoredBtn color={"red"} onClick={fn}>
							{isSubmitting ? "Attendi..." : "Elimina"}
						</ColoredBtn>
					</div>
				</dialog>
			</div>,
			document.getElementById("modal")
		);
	}

	return createPortal(
		<div className="fixed inset-0 z-40 flex items-center justify-center">
			<div className="absolute h-screen inset-0 bg-black bg-opacity-50"></div>

			<dialog open className="relative w-11/12 max-w-fit bg-transparent">
				<img
					src={`https://travel-app-be-production.up.railway.app/${image}`}
					alt=""
					className="max-h-screen rounded-2xl border-8 border-orange-600 overflow-hidden"
				/>
				<div className="absolute transition-all top-3 right-3 text-2xl cursor-pointer bg-red-600 hover:bg-red-500 px-2 rounded-md">
					<FontAwesomeIcon
						icon={faXmark}
						onClick={isSubmitting ? null : () => setIsOpen(false)}
						className="text-white"
					/>
				</div>
			</dialog>
		</div>,
		document.getElementById("modal")
	);
});

export default Modal;
