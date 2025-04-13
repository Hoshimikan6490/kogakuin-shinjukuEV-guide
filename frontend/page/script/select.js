function getFloor() {
  const building = document.getElementById("building").value;
  const floorSelect = document.getElementById("floor");

  // 階数の選択肢をリセット
  floorSelect.innerHTML = `<option value="" disabled selected>選択してください</option>`;

  // 階数の情報を補完
  if (building == "A") {
    // 高層棟の処理
    const floorsA = [];
    for (let i = 6; i >= 1; i--) {
      floorsA.push({ value: `B${i}`, text: `地下${i}階` });
    }
    for (let i = 1; i <= 28; i++) {
      floorsA.push({ value: i, text: `${i}階` });
    }
    floorsA.forEach((floor) => {
      const option = document.createElement("option");
      option.value = floor.value;
      option.textContent = floor.text;
      floorSelect.add(option);
    });
  } else if (building == "B") {
    // 低層棟の処理
    const floorsB = [];
    for (let i = 6; i >= 1; i--) {
      floorsB.push({ value: `B${i}`, text: `地下${i}階` });
    }
    for (let i = 1; i <= 8; i++) {
      floorsB.push({ value: i, text: `${i}階` });
    }
    floorsB.forEach((floor) => {
      const option = document.createElement("option");
      option.value = floor.value;
      option.textContent = floor.text;
      floorSelect.add(option);
    });
  }
}

async function getRoom() {
  const building = document.getElementById("building").value;
  const floor = document.getElementById("floor").value;
  const roomSelect = document.getElementById("room");

  // 階数の選択肢をリセット
  roomSelect.innerHTML = `<option value="" disabled selected>選択してください</option>`;

  // 階数の情報を補完
  await fetch(
    `http://localhost:3030/roomData?building=${building}&floor=${floor}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      data.forEach((room) => {
        const option = document.createElement("option");
        option.value = room;
        option.textContent = room;
        roomSelect.add(option);
      });
    })
    .catch((error) => {
      window.alert(
        "階数の取得に失敗しました。正常にbackendとの接続設定が行われているか確認してください。"
      );
      console.error("Error fetching room data:", error);
    });
}
