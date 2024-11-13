import { getTaskList, addTask, toggleTaskCompletion, deleteTask, updateTask, registerUpdateCallback } from "./data.js";
window.addEventListener("load", () => {
	const taskInput = document.getElementById("taskInput");
	const addTaskButton = document.getElementById("addTaskButton");
	const ulDOM = document.getElementById("taskList");

	// 添加任务到列表
	function addTaskToList(task) {
		const { text, completed } = task;

		const li = document.createElement("li");
		li.innerHTML = `
					<input type="checkbox" class="complete-checkbox" ${completed ? "checked" : ""}/>
          <span contenteditable="true" class="task-text ${completed ? "completed" : ""}">${text}</span>
					<button class="delete-btn">X</button>
      `;

		ulDOM.appendChild(li);

		// 绑定完成按钮事件
		const completeBtn = li.querySelector(".complete-checkbox");
		completeBtn.addEventListener("change", () => {
			toggleTaskCompletion(task);
			// renderTasks();
		});

		// 绑定删除按钮事件
		const deleteBtn = li.querySelector(".delete-btn");
		deleteBtn.addEventListener("click", () => {
			deleteTask(task);
			// renderTasks();
		});

		// 监听任务编辑
		const taskText = li.querySelector(".task-text");
		function editCallback() {
			const newTask = { ...task, text: taskText.textContent };
			updateTask(newTask);
		}
		taskText.addEventListener("blur", () => {
			editCallback();
		});
		taskText.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				editCallback();
			}
		});
	}

	function renderTasks() {
		const taskList = getTaskList();
		console.log("taskList: ", taskList);
		ulDOM.innerHTML = "";
		taskList.forEach((task) => {
			addTaskToList(task);
		});
	}

	// 点击添加按钮时
	addTaskButton.addEventListener("click", () => {
		addTask(taskInput.value);
		// renderTasks();
		taskInput.value = "";
	});

	// 按回车键也可以添加任务
	taskInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			addTask(e.target.value);
			// renderTasks();
			e.target.value = "";
		}
	});

	renderTasks();

	registerUpdateCallback(renderTasks);
});
