const dots = document.querySelectorAll(".dot");
const linePath = document.getElementById("linePath");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const savedTable = document
  .getElementById("savedTable")
  .getElementsByTagName("tbody")[0];
const recordCountSpan = document.getElementById("recordCount");

let pattern = [];
let recordCount = 0;

function updateRecordCount() {
  recordCountSpan.textContent = recordCount.toString().padStart(2, "0");
}

function connectDots(dot) {
  const index = parseInt(dot.dataset.index);
  const rect = dot.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  dot.classList.add("active");
  pattern.push(index);
  updateLinePath();
}

function updateLinePath() {
  let path = "";
  pattern.forEach((circle, index) => {
    const dot = document.querySelector(`.dot[data-index="${circle}"]`);
    const rect = dot.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (index === 0) {
      path += `M${x},${y}`;
    } else {
      path += ` L${x},${y}`;
    }
  });
  linePath.setAttribute("d", path);
}

function resetPattern() {
  dots.forEach((dot) => dot.classList.remove("active"));
  pattern = [];
  updateLinePath();
}

dots.forEach((dot) => {
  dot.addEventListener("mousedown", () => {
    connectDots(dot);
  });
});

resetBtn.addEventListener("click", () => {
  resetPattern();
});

saveBtn.addEventListener("click", () => {
  if (pattern.length < 3) {
    alert("Error: Pattern must be more than 2 dots.");
    return;
  }

  const patternStr = pattern.join(" > ");
  const existingPattern = Array.from(savedTable.rows).find((row) => {
    const patternCell = row.cells[1];
    return patternCell.textContent.trim() === patternStr;
  });

  if (existingPattern) {
    alert("Error: Pattern already exists in the table.");
    return;
  }

  const id = savedTable.rows.length + 1;
  const row = savedTable.insertRow();
  const idCell = row.insertCell(0);
  const patternCell = row.insertCell(1);
  const deleteCell = row.insertCell(2);

  idCell.textContent = id;
  patternCell.textContent = pattern.join(" > ");
  deleteCell.innerHTML = `<input type="checkbox" class="record-checkbox">`;

  recordCount++;
  updateRecordCount();

  resetPattern();
});

deleteSelectedBtn.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".record-checkbox:checked");
  if (checkboxes.length === 0) {
    alert("Error: Please select records to delete.");
    return;
  }

  const confirmDelete = confirm(
    "Are you sure you want to delete selected records?"
  );
  if (confirmDelete) {
    checkboxes.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      row.remove();
      recordCount--;
    });
    updateRecordCount();
  }
});

deleteAllBtn.addEventListener("click", () => {
  const confirmDeleteAll = confirm(
    "Are you sure you want to delete all records?"
  );
  if (confirmDeleteAll) {
    while (savedTable.rows.length > 0) {
      savedTable.deleteRow(0);
      recordCount--;
    }
    updateRecordCount();
  }
});

document.addEventListener("mouseover", (event) => {
  const target = event.target;
  if (target.classList.contains("record-checkbox")) {
    target.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".record-checkbox:checked");
      if (checkboxes.length === 0) {
        deleteSelectedBtn.style.visibility = "hidden";
      } else {
        deleteSelectedBtn.style.visibility = "visible";
      }
    });
  }
});

document.addEventListener("mouseout", () => {
  deleteSelectedBtn.style.visibility = "hidden";
});
