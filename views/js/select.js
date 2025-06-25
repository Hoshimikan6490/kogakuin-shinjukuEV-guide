export async function getFloor() {
  const building = document.getElementById("building").value;
  const floorSelect = document.getElementById("floor");

  // 部屋情報を取得
  const roomData = await getRoomList();

  // 階数の選択肢をリセット
  floorSelect.innerHTML = `<option value="" disabled selected>選択してください</option>`;

  // 階数の情報を補完
  if (building == "A") {
    // 高層棟の処理
    const floorsA = [];
    for (let i = 6; i >= 1; i--) {
      // 部屋情報の登録数の確認
      let roomCount = await getRoomCount(roomData, building, `B${i}`);
      floorsA.push({ value: `B${i}`, text: `地下${i}階 (${roomCount})` });
    }
    for (let i = 1; i <= 28; i++) {
      // 部屋情報の登録数の確認
      let roomCount = await getRoomCount(roomData, building, i);
      floorsA.push({ value: i, text: `${i}階 (${roomCount})` });
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
      // 部屋情報の登録数の確認
      let roomCount = await getRoomCount(roomData, building, `B${i}`);
      floorsB.push({ value: `B${i}`, text: `地下${i}階 (${roomCount})` });
    }
    for (let i = 1; i <= 8; i++) {
      // 部屋情報の登録数の確認
      let roomCount = await getRoomCount(roomData, building, i);
      floorsB.push({ value: i, text: `${i}階 (${roomCount})` });
    }
    floorsB.forEach((floor) => {
      const option = document.createElement("option");
      option.value = floor.value;
      option.textContent = floor.text;
      floorSelect.add(option);
    });
  }
}

export async function getRoomList() {
  const response = await fetch(`/roomData`, { method: "GET" });
  const data = await response.json();
  return data;
}

export async function getRoomCount(roomData, building, floor) {
  // 指定された階の部屋数をカウント
  return roomData[building][floor]?.length || 0;
}

export async function getRoom() {
  const building = document.getElementById("building").value;
  const floor = document.getElementById("floor").value;
  const roomSelect = document.getElementById("room");

  // 階数の選択肢をリセット
  roomSelect.innerHTML = `<option value="" disabled selected>選択してください</option>`;

  // 階数の情報を補完
  await fetch(`/roomData?building=${building}&floor=${floor}`, {
    method: "GET",
  })
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
