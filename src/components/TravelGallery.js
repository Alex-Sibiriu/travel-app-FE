import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTravel, setIsSubmitting } from "../store/travelSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "../store/axios";
import ColoredBtn from "./UI/ColoredBtn";
import Modal from "./UI/Modal";
import { Form } from "react-router-dom";

export default function TravelGallery() {
	const isSubmitting = useSelector((state) => state.travel.isSubmitting);
	const selectedTravel = useSelector((state) => state.travel.selectedTravel);
	const [selectedImage, setSelectedImage] = useState();
	const [errors, setErrors] = useState({});

	// Stato per gestire le immagini selezionate e le anteprime
	const [selectedImages, setSelectedImages] = useState([]);
	const [previews, setPreviews] = useState([]);

	const dispatch = useDispatch();
	const modal = useRef();
	const imageModal = useRef();
	const imageId = useRef(null);

	const images = [...selectedTravel.images].reverse();

	function handleImageChange(e) {
		setErrors({});
		setPreviews([]);

		const files = Array.from(e.target.files);
		const maxSize = 2 * 1024 * 1024;
		const totalSize = files.reduce((tot, file) => tot + file.size, 0);

		if (totalSize > maxSize) {
			setErrors({ images: ["La dimensione dei file supera i 2MB"] });
			e.target.value = null;
			return;
		}

		setSelectedImages(files);

		// Creare anteprime per tutte le immagini selezionate
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviews((prevPreviews) => [...prevPreviews, reader.result]);
			};
			reader.readAsDataURL(file);
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (!navigator.onLine) {
			return;
		}

		dispatch(setIsSubmitting(true));

		const formData = new FormData();
		formData.append("travel_id", selectedTravel.id);
		selectedImages.forEach((image) => {
			formData.append("images[]", image);
		});

		try {
			const response = await axios.post("/api/images/store", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			dispatch(setSelectedTravel(response.data.travel));
			setSelectedImages([]);
			setPreviews([]);
			setErrors({});
		} catch (error) {
			if (error.response && error.response.data.errors) {
				setErrors(error.response.data.errors);
			} else {
				setErrors({
					err: [
						"Errore durante il caricamento delle immagini: " + error.message,
					],
				});
			}
		}

		dispatch(setIsSubmitting(false));
	}

	async function handleDelete() {
		if (!navigator.onLine) {
			return;
		}

		dispatch(setIsSubmitting(true));
		try {
			const response = await axios.delete(
				`/api/images/delete/${imageId.current}`
			);

			if (response.data.success) {
				dispatch(setSelectedTravel(response.data.travel));
			}
		} catch (error) {
			if (error.response && error.response.data.errors) {
				setErrors(error.response.data.errors);
			} else {
				setErrors({
					err: [
						"Errore durante l'eliminazione dell'immagine: " + error.message,
					],
				});
			}
		}

		modal.current.close();
		imageModal.current.close();
		dispatch(setIsSubmitting(false));
	}

	function handleModal(id) {
		if (!navigator.onLine) {
			return;
		}

		imageId.current = id;

		modal.current.open();
	}

	function handleImageModal(img) {
		imageId.current = img.id;
		setSelectedImage(img.path);

		imageModal.current.open();
	}

	return (
		<div className="border-8 px-4 pt-8 pb-4 text-black border-orange-600 rounded-3xl overflow-hidden bg-gradient-to-br from-sage to-darkSage relative">
			<Modal
				ref={modal}
				title="Vuoi davvero eliminare questa foto?"
				fn={handleDelete}
			/>
			<Modal ref={imageModal} image={selectedImage} />

			{images.length < 1 && (
				<p className="pb-8">Nessuna foto per questo viaggio.</p>
			)}

			<div className="flex flex-wrap gap-4 justify-center pb-8">
				{images.map((image, i) => (
					<div
						key={image.path}
						className="rounded-lg bg-black border-4 border-zinc-400 overflow-hidden transition-all hover:scale-105 relative cursor-pointer"
					>
						<img
							src={`https://travel-app-be-production.up.railway.app/${image.path}`}
							alt={`image-${i}`}
							className="h-52 min-w-52"
							onClick={() => handleImageModal(image)}
							onError={(e) => {
								e.target.onerror = null;
								e.target.style.display = "none";
								e.target.parentNode.insertAdjacentHTML(
									"beforeend",
									'<div class="h-52 min-w-52 px-4 flex items-center justify-center text-white bg-zinc-600">Impossibile caricare l\'immagine</div>'
								);
							}}
						/>
						{navigator.onLine && (
							<FontAwesomeIcon
								icon={faTrashCan}
								className="absolute top-1 right-1 p-1 rounded-md text-white bg-red-600 hover:bg-red-500"
								onClick={() => handleModal(image.id)}
							/>
						)}
					</div>
				))}
			</div>

			{navigator.onLine && (
				<div className="bg-zinc-200 border-2 border-zinc-300 rounded-2xl py-4">
					<h3>Carica immagini (massimo 2mb)</h3>

					{/* Visualizzazione degli errori */}
					{Object.keys(errors).map((key) => (
						<div key={key} className="text-red-700 my-4">
							{errors[key].map((error, index) => (
								<p key={index}>{error}</p>
							))}
						</div>
					))}

					<Form onSubmit={handleSubmit}>
						<input
							type="file"
							name="images[]"
							id="images"
							onChange={handleImageChange}
							className="my-8"
							disabled={isSubmitting}
							multiple
							required
						/>
						<div>
							<ColoredBtn type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Attendi..." : "Salva"}
							</ColoredBtn>
						</div>
					</Form>
					<div className="flex flex-wrap justify-center mt-4">
						{previews.map((preview, index) => (
							<img
								key={index}
								src={preview}
								loading="lazy"
								alt={`Anteprima ${index}`}
								className="h-52 min-w-52 object-cover m-2 border-2 border-zinc-400 rounded-md"
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
