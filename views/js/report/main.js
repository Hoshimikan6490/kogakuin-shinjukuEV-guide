import { getFloor, getRoom } from "/js/select.js";
import { onSubmit } from "/js/report/onSubmit.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");
  const buildingSelect = document.getElementById("building");
  const floorSelect = document.getElementById("floor");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await onSubmit();
    });
  }

  if (buildingSelect) {
    buildingSelect.addEventListener("change", getFloor);
  }

  if (floorSelect) {
    floorSelect.addEventListener("change", getRoom);
  }
});
