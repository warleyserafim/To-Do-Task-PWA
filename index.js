var db = new Dexie('TodoApp');
db.version(1).stores({ todos: "++id, todo" });

const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks")

//add todo

form.onsubmit = async (event) => {
    event.preventDefault();
    const todo = input.value;
    await db.todos.add({ todo });
    await getTodos();
    form.reset();
};

// display todo

const getTodos = async () => {
    const allTodos = await  db.todos.reverse().toArray();
    list_el.innerHTML = allTodos.map(
        (todo) =>
        `
    <div class="task">
    <div class="content">
    <input id="edit" class="text" readonly="readonly" type="text" value= ${todo.todo}>
    </div>
    <div class="actions">
    <button class="delete" onclick="deleteTodo(event, ${todo.id})">Delete</button>
    <button class="edit" onclick="editTodo(event, ${todo.id})">Edit</button>
    </div>
    </div>
    `
    ).join("");
};


const editTodo = async (event, id) => {
    const todo = await db.todos.get(id);
    const input = event.target.parentElement.parentElement.querySelector("input");
    input.removeAttribute("readonly");
    input.focus();
    input.onblur = async () => {
        input.setAttribute("readonly", "readonly");
        await db.todos.update(id, { todo: input.value });
        await getTodos();
    };
};


window.onload = getTodos();


//Delete todo

const deleteTodo = async (event, id) => {
    await db.todos.delete(id)
    await getTodos();
};