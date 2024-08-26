import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedTravel: JSON.parse(localStorage.getItem("selectedTravel")) || null,
	activeDay: JSON.parse(localStorage.getItem("activeDay")) || {
		id: null,
		dayStops: [],
	},
	day: JSON.parse(localStorage.getItem("day")) || null,
	isSubmitting: false,
};

const travelSlice = createSlice({
	name: "selectedTravel",
	initialState: initialState,
	reducers: {
		setSelectedTravel(state, action) {
			state.selectedTravel = action.payload;
			localStorage.setItem("selectedTravel", JSON.stringify(action.payload));
		},

		deleteTravel(state, action) {
			state.selectedTravel = null;
			localStorage.removeItem("selectedTravel");
		},

		setActiveDay(state, action) {
			state.activeDay = action.payload;
			localStorage.setItem("activeDay", JSON.stringify(action.payload));
		},

		addStop(state, action) {
			const stop = action.payload;
			state.selectedTravel.stops.push(stop);
			state.activeDay.dayStops.push(stop);

			localStorage.setItem(
				"selectedTravel",
				JSON.stringify(state.selectedTravel)
			);
			localStorage.setItem("activeDay", JSON.stringify(state.activeDay));
		},

		updateStop(state, action) {
			const updatedStop = action.payload;

			const stopIndex = state.activeDay.dayStops.findIndex(
				(stop) => stop.id === updatedStop.id
			);

			if (stopIndex !== -1) {
				state.activeDay.dayStops[stopIndex] = {
					...state.activeDay.dayStops[stopIndex],
					...updatedStop,
				};
			}

			const travelStopIndex = state.selectedTravel.stops.findIndex(
				(stop) => stop.id === updatedStop.id
			);

			if (travelStopIndex !== -1) {
				state.selectedTravel.stops[travelStopIndex] = {
					...state.selectedTravel.stops[travelStopIndex],
					...updatedStop,
				};
			}

			localStorage.setItem(
				"selectedTravel",
				JSON.stringify(state.selectedTravel)
			);
			localStorage.setItem("activeDay", JSON.stringify(state.activeDay));
		},

		changeStopOrder(state, action) {
			const stops = action.payload;

			const updatedStops = stops.map((s, index) => {
				return { ...s, order: index + 1 };
			});

			state.activeDay.dayStops = [...updatedStops];

			const travelStops = state.selectedTravel.stops.map((stop) => {
				const updatedStop = updatedStops.find(
					(updated) => updated.id === stop.id
				);
				return updatedStop ? { ...stop, order: updatedStop.order } : stop;
			});

			state.selectedTravel.stops = [...travelStops];

			localStorage.setItem(
				"selectedTravel",
				JSON.stringify(state.selectedTravel)
			);
			localStorage.setItem("activeDay", JSON.stringify(state.activeDay));
		},

		deleteStop(state, action) {
			const stopId = action.payload.id;

			state.activeDay.dayStops = state.activeDay.dayStops
				.filter((stop) => stop.id !== stopId)
				.map((stop, index) => ({
					...stop,
					order: index + 1,
				}));

			state.selectedTravel.stops = state.selectedTravel.stops
				.filter((stop) => stop.id !== stopId)
				.map((stop, index) => ({
					...stop,
					order: index + 1,
				}));

			localStorage.setItem(
				"selectedTravel",
				JSON.stringify(state.selectedTravel)
			);
			localStorage.setItem("activeDay", JSON.stringify(state.activeDay));
		},

		setIsSubmitting(state, action) {
			state.isSubmitting = action.payload;
		},
	},
});

export const {
	setSelectedTravel,
	deleteTravel,
	setActiveDay,
	addStop,
	updateStop,
	changeStopOrder,
	deleteStop,
	setIsSubmitting,
} = travelSlice.actions;

export default travelSlice.reducer;
