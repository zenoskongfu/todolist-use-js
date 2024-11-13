let taskList = [];
const callbacks = [];

// 从本地存储加载任务
function loadTasks() {
	const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
	console.log(tasks);
	return tasks;
}

// 添加任务
function addTask(taskText) {
	if (taskText.trim() === "") return;
	taskList.push({ id: Date.now(), text: taskText, completed: false });
}

// 切换任务完成状态
function toggleTaskCompletion(taskToToggle) {
	taskList = taskList.map((task) => (task.id === taskToToggle.id ? { ...task, completed: !task.completed } : task));
}

// 删除任务
function deleteTask(taskToDelete) {
	taskList = taskList.filter((task) => task.id !== taskToDelete.id);
}

// 更新任务
function updateTask(oldTask, newTask) {
	taskList = taskList.map((task) => {
		if (oldTask.id !== newTask.id) {
			return task;
		}
		task.text = newTask.text;
		return task;
	});
}

function getTaskList() {
	return taskList;
}

function registerUpdateCallback(callback) {
	if (typeof callback === "function") {
		callbacks.push(callback);
	}
}

window.addEventListener("load", () => {
	taskList = loadTasks();
});
window.addEventListener("beforeunload", () => {
	localStorage.setItem("tasks", JSON.stringify(taskList));
});

const wrapperTaskList = new Proxy(taskList, {
	set: (target, property, value) => {
		target[property] = value;
		callbacks.forEach((callback) => callback(target));
		return true;
	},
});

export { getTaskList, addTask, toggleTaskCompletion, deleteTask, updateTask, registerUpdateCallback };
