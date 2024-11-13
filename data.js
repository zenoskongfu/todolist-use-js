const callbacks = [];

function runUpdateCallbacks(taskList) {
	callbacks.forEach((callback) => callback(taskList));
}

function registerUpdateCallback(callback) {
	if (typeof callback === "function") {
		callbacks.push(callback);
	}
}

const proxyObj = (obj, callback) => {
	return new Proxy(obj, {
		set(target, property, value) {
			console.log("set", property);
			target[property] = value;
			if (property === "length") {
				callback && callback(target);
			}
			return true;
		},
	});
};

let taskList = new Proxy(
	{ value: [] },
	{
		set: (target, property, value) => {
			if (property === "value") {
				target[property] = proxyObj(value, runUpdateCallbacks);
				window.temp1 = target[property];

				runUpdateCallbacks();
			}

			return true;
		},
	}
);

// 从本地存储加载任务
function loadTasks() {
	const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
	console.log(tasks);
	return tasks;
}

// 添加任务
function addTask(taskText) {
	if (taskText.trim() === "") return;
	taskList.value.push({ id: Date.now(), text: taskText, completed: false });
}

// 切换任务完成状态
function toggleTaskCompletion(taskToToggle) {
	taskList.value = taskList.value.map((task) =>
		task.id === taskToToggle.id ? { ...task, completed: !task.completed } : task
	);
}

// 删除任务
function deleteTask(taskToDelete) {
	taskList.value = taskList.value.filter((task) => task.id !== taskToDelete.id);
}

// 更新任务
function updateTask(oldTask, newTask) {
	taskList.value = taskList.value.map((task) => {
		if (oldTask.id !== newTask.id) {
			return task;
		}
		task.text = newTask.text;
		return task;
	});
}

function getTaskList() {
	return taskList.value;
}

window.addEventListener("load", () => {
	taskList.value = loadTasks();
	registerUpdateCallback(() => {
		console.log("开始更新");
	});
});

window.addEventListener("beforeunload", () => {
	localStorage.setItem("tasks", JSON.stringify(taskList.value));
});

export { getTaskList, addTask, toggleTaskCompletion, deleteTask, updateTask, registerUpdateCallback };
