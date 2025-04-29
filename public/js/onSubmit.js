export function onSubmit() {
  let room = document.getElementById("room").value;

  if (!room) return;

  let url = location.host;
  document.location = `http://${url}/search?room=${room}`;

  // formのsubmitを押した時に勝手にページ遷移しないためにfalse
  return false;
}
