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

function getRoom() {}
