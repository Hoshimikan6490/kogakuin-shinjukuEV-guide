export function onSubmit() {
	let room = document.getElementById("room").value;

	if (!room) return;

	let url = location.host;
	let protocol = location.protocol;
	document.location = `${protocol}//${url}/search?room=${room}`;

	// formのsubmitを押した時に勝手にページ遷移しないためにfalse
	return false;
}
