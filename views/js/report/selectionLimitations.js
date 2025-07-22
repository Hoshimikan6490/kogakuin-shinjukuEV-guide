export function selectionLimitations(selectedValue, selectedType) {
	const evSelect = document.getElementById("EV");
	const stairsSelect = document.getElementById("stairs");

	if (selectedValue === "none") {
		// 片方をnoneにした場合、もう片方をnone以外に制限
		if (selectedType === "EV") {
			// エレベーターをnoneにした場合、階段からnoneオプションを削除
			removeNoneOption(stairsSelect);
			// 優先順位を階段に固定
			setOrderOfPriority("stairs");
		} else if (selectedType === "stairs") {
			// 階段をnoneにした場合、エレベーターからnoneオプションを削除
			removeNoneOption(evSelect);
			// 優先順位をエレベーターに固定
			setOrderOfPriority("EV");
		}
	} else {
		// none以外を選択した場合
		// もう片方の選択肢を取得
		const otherSelect = selectedType == "EV" ? stairsSelect : evSelect;

		// もう一方がnone以外なら、両方にnoneオプションを復活
		if (otherSelect.value !== "none") {
			addNoneOption(evSelect);
			addNoneOption(stairsSelect);
			// 優先順位選択を再び有効化
			enableOrderOfPrioritySelection();
		} else {
			// もう一方がnoneの場合は、そちらにnoneオプションを追加
			addNoneOption(otherSelect);
		}
	}
}

// noneオプションを削除する関数
function removeNoneOption(selectElement) {
	const noneOption = selectElement.querySelector('option[value="none"]');
	if (noneOption) {
		noneOption.remove();
	}
}

// noneオプションを追加する関数
function addNoneOption(selectElement) {
	const noneOption = selectElement.querySelector('option[value="none"]');
	if (!noneOption) {
		const option = document.createElement("option");
		option.value = "none";
		option.textContent = "❌使用しない";
		selectElement.appendChild(option);
	}
}

// 優先順位を設定する関数
function setOrderOfPriority(priority) {
	const orderOfPrioritySelect = document.getElementById("orderOfPriority");
	orderOfPrioritySelect.value = priority;
	// 選択を無効化
	orderOfPrioritySelect.disabled = true;
}

// 優先順位選択を有効化する関数
function enableOrderOfPrioritySelection() {
	const orderOfPrioritySelect = document.getElementById("orderOfPriority");
	const evValue = document.getElementById("EV").value;
	const stairsValue = document.getElementById("stairs").value;

	// 両方ともnone以外が選択されている場合のみ選択可能
	if (
		evValue !== "none" &&
		stairsValue !== "none" &&
		evValue !== "" &&
		stairsValue !== ""
	) {
		orderOfPrioritySelect.disabled = false;
	}
}
