import { getFloor, getRoom } from "/js/select.js";
import { onSubmit } from "/js/report/onSubmit.js";
import { selectionLimitations } from "/js/report/selectionLimitations.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");
  const buildingSelect = document.getElementById("building");
  const floorSelect = document.getElementById("floor");
  const evSelect = document.getElementById("EV");
  const stairsSelect = document.getElementById("stairs");

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

  // エレベーターの選択変更時の処理
  if (evSelect) {
    evSelect.addEventListener("change", (e) => {
      selectionLimitations(e.target.value, "EV");
    });
  }

  // 階段の選択変更時の処理
  if (stairsSelect) {
    stairsSelect.addEventListener("change", (e) => {
      selectionLimitations(e.target.value, "stairs");
    });
  }
});
