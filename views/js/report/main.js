import { onSubmit } from "/js/report/onSubmit.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await onSubmit();
    });
  }
});
