document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      const result = onSubmit();
      if (!result) {
        e.preventDefault();
      }
    });
  }
});

async function onSubmit() {
  fetch("/routeDataSubmit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      EV: document.getElementById("EV").value,
      stairs: document.getElementById("stairs").value,
      orderOfPriority: document.getElementById("orderOfPriority").value,
    }),
  });
}
