document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      await onSubmit();
      e.preventDefault();
    });
  }
});

async function onSubmit() {
  fetch("/api/routeDataSubmit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room: document.getElementById("room").value,
      EV: document.getElementById("EV").value,
      stairs: document.getElementById("stairs").value,
      orderOfPriority: document.getElementById("orderOfPriority").value,
    }),
  });

  // TODO: 報告完了の旨を表示し、その後トップ画面に戻るようにする
}
