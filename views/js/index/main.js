import { getFloor, getRoom } from "/js/select.js";
import { onSubmit } from "/js/index/onSubmit.js";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("roomForm");
	const buildingSelect = document.getElementById("building");
	const floorSelect = document.getElementById("floor");

	if (form) {
		form.addEventListener("submit", (e) => {
			const result = onSubmit();
			if (!result) {
				e.preventDefault();
			}
		});
	}

	if (buildingSelect) {
		buildingSelect.addEventListener("change", getFloor);
	}

	if (floorSelect) {
		floorSelect.addEventListener("change", getRoom);
	}
});
