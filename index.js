// script.js

document.addEventListener("DOMContentLoaded", () => {
	const taskInput = document.getElementById("taskInput");
	const addTaskButton = document.getElementById("addTaskButton");
	const taskList = document.getElementById("taskList");

	// 从本地存储加载任务
	function loadTasks() {
		const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		tasks.forEach((task) => {
			addTaskToList(task);
		});
	}

	// 添加任务到列表
	function addTaskToList(task) {
		const li = document.createElement("li");
		li.innerHTML = `
          <span contenteditable="true" class="task-text">${task}</span>
          <button class="delete-btn">X</button>
      `;
		taskList.appendChild(li);

		// 绑定删除按钮事件
		const deleteBtn = li.querySelector(".delete-btn");
		deleteBtn.addEventListener("click", () => {
			deleteTask(task);
			li.remove();
		});

		// 监听任务编辑
		const taskText = li.querySelector(".task-text");
		taskText.addEventListener("blur", () => {
			updateTask(task, taskText.textContent);
		});
	}

	// 添加任务
	function addTask() {
		const task = taskInput.value.trim();
		if (task) {
			addTaskToList(task);
			saveTask(task);
			taskInput.value = ""; // 清空输入框
		}
	}

	// 删除任务
	function deleteTask(taskToDelete) {
		let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		tasks = tasks.filter((task) => task !== taskToDelete);
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	// 更新任务
	function updateTask(oldTask, newTask) {
		let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		tasks = tasks.map((task) => (task === oldTask ? newTask : task));
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	// 保存任务到本地存储
	function saveTask(task) {
		let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		tasks.push(task);
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	// 点击添加按钮时
	addTaskButton.addEventListener("click", addTask);

	// 按回车键也可以添加任务
	taskInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			addTask();
		}
	});

	// 页面加载时加载已有任务
	loadTasks();
});
