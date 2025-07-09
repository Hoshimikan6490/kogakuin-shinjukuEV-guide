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
  let status = await fetch("/api/routeDataSubmit", {
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

  if (status.ok) {
    alert("報告が完了しました。ありがとうございます！");
    window.location.href = "/";
  } else {
    alert("報告に失敗しました。もう一度お試しください。");
  }
}
