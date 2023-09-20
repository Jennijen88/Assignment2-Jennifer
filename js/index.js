// Fungsi untuk membuat elemen tugas dan menjadikannya draggable
function createTaskElement(text) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.textContent = text;
  task.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", text);
  });
  return task;
}

// Fungsi yang menghapus semua tugas dan menghapus mereka dari localStorage
function resetAllTasks() {
  const taskLists = document.querySelectorAll(".task-list");
  taskLists.forEach((taskList) => {
    taskList.innerHTML = "";
  });
  localStorage.removeItem("tasks"); // Menghapus semua tugas dari localStorage
  localStorage.removeItem("tasksColumns"); // Menghapus informasi kolom tugas dari localStorage
}

// Event listener untuk tombol "Reset"
document.getElementById("clear-button").addEventListener("click", resetAllTasks);

// Fungsi untuk menambahkan tugas dari input ke kolom yang sesuai
function addTaskFromInput() {
  const inputElement = document.getElementById("task-input");
  const taskText = inputElement.value;
  if (!taskText) return;

  const task = createTaskElement(taskText);
  task.addEventListener("dragend", () => {
    task.remove();
  });

  const targetColumn = inputElement.closest(".column");
  targetColumn.querySelector(".task-list").appendChild(task);

  // Simpan tugas ke localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Simpan informasi kolom tugas ke localStorage
  const tasksColumns = JSON.parse(localStorage.getItem("tasksColumns")) || {};
  tasksColumns[taskText] = targetColumn.id;
  localStorage.setItem("tasksColumns", JSON.stringify(tasksColumns));

  inputElement.value = "";
}

// Tambahkan event listener ke tombol "Submit"
document.getElementById("submit-button").addEventListener("click", addTaskFromInput);

// Fungsi yang memungkinkan elemen di-drop pada kolom tugas
function allowDrop(event) {
  event.preventDefault();
}

// Fungsi yang menangani peristiwa drop untuk mengubah kolom tugas
function drop(event) {
  event.preventDefault();
  const text = event.dataTransfer.getData("text/plain");
  const targetColumn = event.target.closest(".column");

  if (targetColumn) {
    const task = createTaskElement(text);
    task.addEventListener("dragend", () => {
      task.remove();
    });

    targetColumn.querySelector(".task-list").appendChild(task);

    // Simpan informasi kolom tugas yang ditarik ke localStorage
    const tasksColumns = JSON.parse(localStorage.getItem("tasksColumns")) || {};
    tasksColumns[text] = targetColumn.id;
    localStorage.setItem("tasksColumns", JSON.stringify(tasksColumns));
  }
}

// Memuat tugas dari localStorage saat halaman dimuat
window.addEventListener("load", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const tasksColumns = JSON.parse(localStorage.getItem("tasksColumns")) || {};

  tasks.forEach((taskText) => {
    const task = createTaskElement(taskText);
    task.addEventListener("dragend", () => {
      task.remove();
    });

    const columnId = tasksColumns[taskText];
    const targetColumn = document.getElementById(columnId);
    if (targetColumn) {
      // Tambahkan tugas ke kolom yang sesuai
      targetColumn.querySelector(".task-list").appendChild(task);
    } else {
      // Default jika tidak ada informasi kolom yang sesuai
      document.getElementById("task-list-todo").appendChild(task);
    }
  });
});
