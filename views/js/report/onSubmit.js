export async function onSubmit() {
	await fetch("/api/routeDataSubmit", {
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
	})
		.then((response) => {
			if (!response.ok) {
				// エラーレスポンスの場合
				return response.text().then((text) => {
					alert(text);
					throw new Error(text);
				});
			}
			return response.text();
		})
		.then((data) => {
			alert(data);
			window.location.href = "/";
		})
		.catch((error) => {
			console.error("送信エラー:", error);
		});
}
