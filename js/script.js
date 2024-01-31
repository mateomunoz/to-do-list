const tasksElement = document.getElementById('tasks');
const filtersElement = document.getElementById('filters');
const formElement = document.getElementById('form');
const itemsLeftElement = document.getElementById('items-left');
const deleteCompleteElement = document.getElementById('delete-completed');
const switchElement = document.getElementById('switch');
const allFilters = document.querySelectorAll('.filter');

//let darkMode = false;
//tareas
let allTasks = [
  {
    id: Date.now(),
    task: 'Make a todo app',
    completed: false
  }
];
/*cambiar a modo oscuro
const changeTheme = () => {
  darkMode = !darkMode;

  if (darkMode) {
    document.body.classList.add('dark');
    switchElement.src = 'images/icon-sun.svg';
  } else {
    document.body.classList.remove('dark');
    switchElement.src = 'images/icon-moon.svg';
  }
};*/
//tareas filtradas
const getFilteredTasks = () => {
  const currentFilter =
    document.querySelector('.filter--active').dataset.filter;
  let filteredTasks = allTasks;

  if (currentFilter === 'active') {
    filteredTasks = allTasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = allTasks.filter(task => task.completed);
  }

  return filteredTasks;
};
//tareas pendientes
const countItemsLeft = () => {
  const itemsLeft = allTasks.filter(task => !task.completed).length;
  if (allTasks.length === 0) {
    itemsLeftElement.textContent = 'No tasks';
  } else if (itemsLeft === 0) {
    itemsLeftElement.textContent = 'All tasks completed!';
  } else {
    itemsLeftElement.textContent = `${itemsLeft} items left`;
  }
};
//insertar tareas en el DOM
const insertTasks = tasks => {
  const fragment = document.createDocumentFragment();

  tasks.forEach(task => {
    const newTaskContainer = document.createElement('div');
    newTaskContainer.classList.add('task-container');

    const newTaskCheck = document.createElement('input');
    newTaskCheck.classList.add('task-check');
    newTaskCheck.type = 'checkbox';
    newTaskCheck.checked = task.completed;
    newTaskCheck.id = task.id;

    const newTaskText = document.createElement('label');
    newTaskText.classList.add('task-text');
    newTaskText.textContent = task.task;
    newTaskText.htmlFor = task.id;

    const newTaskDelete = document.createElement('img');
    newTaskDelete.classList.add('task-delete');
    newTaskDelete.src = 'images/icon-cross.svg';

    newTaskDelete.addEventListener('click', () => deleteTask(task.id));

    newTaskCheck.addEventListener('change', () => completeTask(task.id));

    newTaskContainer.append(newTaskCheck, newTaskText, newTaskDelete);

    fragment.append(newTaskContainer);
  });

  tasksElement.textContent = '';
  tasksElement.append(fragment);
  countItemsLeft();
};
//guardar tareas
const saveTask = task => {
  allTasks.push(task);
  const tasksToRender = getFilteredTasks();
  insertTasks(tasksToRender);
};
//eliminarla
const deleteTask = id => {
  allTasks = allTasks.filter(task => task.id !== id);
  console.log(allTasks);
  insertTasks(allTasks);
};
//marcar o desmarcar
const completeTask = id => {
  allTasks = allTasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  const filteredTasks = getFilteredTasks();
  insertTasks(filteredTasks);
};
//crear una nueva
const createTask = task => {
  const newTask = {
    id: Date.now(),
    task: task,
    completed: false
  };

  saveTask(newTask);
};
//cambiar filtro
const changeFilter = filterTarget => {
  [...allFilters].forEach(filter => {
    filter.classList.remove('filter--active');
  });

  filterTarget.classList.add('filter--active');
};
//filtra las tareas
const filterTasks = filterTarget => {
  changeFilter(filterTarget);
  const filteredTasks = getFilteredTasks(filterTarget);
  insertTasks(filteredTasks);
};
//todas las tareas completadas las elimina
const deleteAllCompleteTasks = () => {
  allTasks = allTasks.filter(task => !task.completed);
  insertTasks(allTasks);
};
//insertar las tareas del principio en el DOM
insertTasks(allTasks);

//evento para el modo oscuro
//switchElement.addEventListener('click', changeTheme);

//manejo del formulario
formElement.addEventListener('submit', event => {
  event.preventDefault();
  if (event.target.task.value === '') return;
  createTask(event.target.task.value);
  event.target.reset();
});
//evento para eliminar las tareas completadas
deleteCompleteElement.addEventListener('click', deleteAllCompleteTasks);
//clics en los filtros
filtersElement.addEventListener('click', event => {
  if (event.target.tagName !== 'BUTTON') return;
  filterTasks(event.target);
});
