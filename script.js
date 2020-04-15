class TodoList {
  constructor() {
    let todos = localStorage.getItem("todos");
    console.log(todos);
    this.todos = JSON.parse(todos) || [];
  }

  uuid(a) {
    return a
      ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
      : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.uuid);
  }

  backup() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  addNewTask(task) {
    this.todos.push({
      id: this.uuid(),
      content: task,
      timeAdded: Date.now(),
      completed: false,
    });
    this.backup();
  }

  markComplete(id) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos[i].completed = true;
      }
    }
    this.backup();
  }

  removeTask(id) {
    const newTodos = this.todos.filter((todo) => todo.id !== id);
    this.todos = [...newTodos];
    this.backup();
  }

  getAllTasks() {
    return this.todos;
  }
}

const list = document.getElementById("list");
const input = document.getElementById("input");
var todoList;

function addTask() {
  const task = input.value;
  input.value = "";
  todoList.addNewTask(task);
  renderTasksToDOM();
}

function renderTasksToDOM() {
  todos = todoList.getAllTasks();
  markup = "";
  todos.forEach((td) => {
    markup += `<li data-id="${td.id}" ${
      td.completed ? `class="completed"` : ""
    }>${td.content} ${
      td.completed
        ? `<span class="remove" data-action="remove">X</span></li>`
        : `<span class="tick" data-action="complete">Y</span></li>`
    }`;
  });
  list.innerHTML = markup;
}

list.addEventListener("click", function (event) {
  event.stopPropagation();
  const targetElement = event.target;
  if (targetElement.tagName !== "SPAN") {
    return;
  }
  const id = targetElement.parentElement.dataset.id;

  if (targetElement.dataset.action === "remove") {
    todoList.removeTask(id);
  } else if (targetElement.dataset.action === "complete") {
    todoList.markComplete(id);
  }
  renderTasksToDOM();
});

function init() {
  todoList = new TodoList();
  renderTasksToDOM();
}

init();
