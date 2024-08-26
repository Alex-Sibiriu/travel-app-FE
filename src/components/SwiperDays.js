import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function SwiperDays({ days, selectDay, activeDay }) {
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);
	const isSubmitting = useSelector((state) => state.travel.isSubmitting);

	const normalClasses =
		"px-2 py-1 font-bold transition-all duration-500 bg-orange-400 hover:bg-orange-500 rounded-t-md cursor-pointer text-white";
	const activeClasses =
		"px-2 py-1 font-bold bg-orange-600 rounded-t-md cursor-pointer text-white";

	return (
		<div className="relative px-8">
			{/* Freccia Sinistra */}
			<div
				className={`w-7 h-7 bg-orange-600 rounded-full flex justify-center items-center cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-10 swiperButtonPrevCustom ${
					isBeginning ? "invisible" : "visible"
				}`}
			>
				<FontAwesomeIcon icon={faChevronLeft} />
			</div>

			<Swiper
				onSlideChange={(swiper) => {
					setIsBeginning(swiper.isBeginning);
					setIsEnd(swiper.isEnd);
				}}
				onSwiper={(swiper) => {
					setIsBeginning(swiper.isBeginning);
					setIsEnd(swiper.isEnd);
				}}
				navigation={{
					nextEl: ".swiperButtonNextCustom",
					prevEl: ".swiperButtonPrevCustom",
				}}
				modules={[Navigation]}
				spaceBetween={4}
				watchOverflow={true}
				slidesPerView={2}
				slidesPerGroup={2}
				breakpoints={{
					450: {
						slidesPerView: 3,
						slidesPerGroup: 3,
					},
					600: {
						slidesPerView: 4,
						slidesPerGroup: 4,
					},
					850: {
						slidesPerView: 7,
						slidesPerGroup: 7,
					},
				}}
				className="mySwiper"
			>
				{days.map((day, index) => {
					return (
						<SwiperSlide
							key={`day-${index + 1}`}
							onClick={isSubmitting ? null : () => selectDay(day)}
							className={day.id == activeDay.id ? activeClasses : normalClasses}
						>
							Giorno {index + 1}
						</SwiperSlide>
					);
				})}
			</Swiper>

			{/* Freccia Destra */}
			<div
				className={`w-7 h-7 shadow-black shadow-sm bg-orange-600 rounded-full flex justify-center items-center cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-10 swiperButtonNextCustom ${
					isEnd ? "invisible" : "visible"
				}`}
			>
				<FontAwesomeIcon icon={faChevronRight} />
			</div>
		</div>
	);
}
