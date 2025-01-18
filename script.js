// Todo portion 
let tasks = [];

const saveTask = ()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
}
document.addEventListener("DOMContentLoaded",()=>{
    const storedTask = JSON.parse(localStorage.getItem('tasks'));

    if(storedTask){
        storedTask.forEach((task)=>tasks.push(task));
    }
    createTaskList();
    progress();
});
const todoButton = document.getElementById('todo-button');
const todoInput = document.getElementById('todo-input');
const taskList = document.getElementById('task-list');

const number = document.getElementById('numbers');
const progressBar = document.getElementById('progress');

const createTaskList = () => {
    taskList.innerHTML = '';

    tasks.forEach((task, idx) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('taskItem');

        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        if (task.completed) taskDiv.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('isDone');
        checkbox.checked = task.completed;

        const taskText = document.createElement('p');
        taskText.textContent = task.text;

        const iconDiv = document.createElement('div');
        iconDiv.classList.add('icon');

        const editIcon = document.createElement('img');
        editIcon.src = './Asset/edit.png';
        editIcon.alt = 'Edit';
        editIcon.addEventListener('click', () => editTask(idx));

        const deleteIcon = document.createElement('img');
        deleteIcon.src = './Asset/bin.png';
        deleteIcon.alt = 'Delete';
        deleteIcon.addEventListener('click', () => deleteTask(idx));

        taskDiv.append(checkbox, taskText);
        iconDiv.append(editIcon, deleteIcon);
        taskItem.append(taskDiv, iconDiv);
        
        taskList.appendChild(taskItem);

        checkbox.addEventListener('change', () => taskComplete(idx));
    });
}

const progress = ()=>{
    const cmplt = tasks.filter(ele => ele.completed).length;
    number.innerText = `${cmplt}/${tasks.length}`;
    progressBar.style.width = `${(cmplt/tasks.length)*100}%`;
}
const taskComplete = (idx) => {
    tasks[idx].completed = !tasks[idx].completed;
    createTaskList();
    progress();
    saveTask();
}

const deleteTask = (idx) => {
    tasks.splice(idx, 1);
    createTaskList(); 
    progress();
    saveTask();
}

const editTask = (idx) => {
    todoInput.value = tasks[idx].text;
    deleteTask(idx);
    progress();
    saveTask();
}

const addTask = () => {
    const text = todoInput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        todoInput.value = '';
        createTaskList();
        progress();
        saveTask();
    }
}

todoButton.addEventListener('click', (event) => {
    event.preventDefault();
    addTask();
})

function clearTasksAfterMidnight() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (currentHour === 0 && currentMinute === 0) {
        const ele = document.createElement('li');
        ele.classList.add('historyItem');
        const task_completion = document.createElement('div');
        
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        let val = (tasks.filter(task => task.completed).length / tasks.length) * 100;
        val = val.toFixed(1);
        task_completion.innerText = `${val}%`;

        const div2 = document.createElement('div');
        div2.innerText = `Task Completed Updated on ${currentTime.toLocaleDateString()}`;
        ele.append(task_completion, div2);

        let history = JSON.parse(localStorage.getItem("history")) || [];
        history.push({ timestamp: new Date().toISOString(), percentage: val });
        
        if (history.length > 7) {
            history.shift(); 
        }
        
        localStorage.setItem("history", JSON.stringify(history));

        localStorage.removeItem('tasks');

        renderHistory();
    }
}

function renderHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = ''; 

    const history = JSON.parse(localStorage.getItem("history")) || [];

    const reversedHistory = history.reverse();

    reversedHistory.forEach(entry => {
        const ele = document.createElement('li');
        ele.classList.add('historyItem');
        
        const task_completion = document.createElement('div');
        task_completion.innerText = `${entry.percentage}%`;
        
        const div2 = document.createElement('div');
        div2.innerText = `Task Completed Updated on ${new Date(entry.timestamp).toLocaleDateString()}`;
        
        ele.append(task_completion, div2);
        historyContainer.appendChild(ele);
    });
}

window.addEventListener('load', renderHistory);
setInterval(clearTasksAfterMidnight, 60000);







// Calender Portion
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const currentMonthTitle = document.getElementById('currentMonth');
const calendarDates = document.querySelector('.calendar-dates');
const eventDateInput = document.getElementById('eventDate');
const eventTitleInput = document.getElementById('eventTitle');
const eventDescriptionInput = document.getElementById('eventDescription');
const addEventButton = document.getElementById('addEvent');

let currentDate = new Date();
let events = loadEventsFromStorage();

function loadEventsFromStorage() {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : {};
}

function saveEventsToStorage() {
    localStorage.setItem('events', JSON.stringify(events)); 
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updateCalendar() {
    const currentMonth = currentDate.getMonth(); 
    const currentYear = currentDate.getFullYear();

    currentMonthTitle.textContent = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentYear;
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    calendarDates.innerHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarDates.appendChild(emptyCell);
    }

    for (let date = 1; date <= lastDateOfMonth; date++) {
        const dateCell = document.createElement('div');
        dateCell.textContent = date;
        dateCell.classList.add('calendar-date');
        const dateString = formatDate(new Date(currentYear, currentMonth, date));
        dateCell.dataset.date = dateString;

        if (dateString === formatDate(new Date())) {
            dateCell.classList.add('today');
        }
        if (events[dateString]) {
            dateCell.classList.add('has-event');
        }

        dateCell.addEventListener('click', function () {
            eventDateInput.value = dateCell.dataset.date;
            showEventPopup(dateCell.dataset.date);
        });

        calendarDates.appendChild(dateCell);
    }
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

addEventButton.addEventListener('click', () => {
    const eventDate = eventDateInput.value;
    const eventTitle = eventTitleInput.value;
    const eventDescription = eventDescriptionInput.value;

    if (!eventDate || !eventTitle) {
        alert('Please provide a date and a title for the session.');
        return;
    }

    if (!events[eventDate]) {
        events[eventDate] = [];
    }

    events[eventDate].push({ title: eventTitle, description: eventDescription });

    saveEventsToStorage();

    eventTitleInput.value = '';
    eventDescriptionInput.value = '';
    eventDateInput.value = '';

    updateCalendar();
});

function showEventPopup(date) {
    const eventList = events[date];
    if (eventList && eventList.length > 0) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        
        const eventItems = eventList.map((event, index) => {
            return `
                <div class="event-item">
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                    <button class="deleteEventButton" data-date="${date}" data-index="${index}">Delete Event</button>
                </div>
            `;
        }).join('');

        popup.innerHTML = `
            <div class="popup-content">
                <h3>Events on ${date}</h3>
                ${eventItems}
                <button id="closePopup">Close</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.querySelectorAll('.deleteEventButton').forEach(button => {
            button.addEventListener('click', (event) => {
                const date = button.getAttribute('data-date');
                const index = button.getAttribute('data-index');
                
                events[date].splice(index, 1);
                
                if (events[date].length === 0) {
                    delete events[date];
                }

                saveEventsToStorage();
                updateCalendar(); 
                document.body.removeChild(popup);  
            });
        });

        document.getElementById('closePopup').addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
    }
}
updateCalendar();

// Mind Map
const canvas = document.querySelector('.mindmap-canvas');
document.getElementById('addNode').addEventListener('click', () => {
    let element = document.createElement('div');
    element.classList.add('node');
    element.innerText = prompt("Enter the node value:");
    canvas.append(element);

    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        element.style.cursor = 'grabbing'; 
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.cursor = 'move'; 
    });
});

let flag = 0;
document.getElementById('deleteNode').addEventListener('click',(e)=>{
    if(flag) flag=0;
    else flag = 1;
});
canvas.addEventListener('click',(e)=>{
    if(flag && e.target != canvas){
        e.target.remove();
        flag=0;
    }
});
document.getElementById('clearMindmap').addEventListener('click',()=>{
    canvas.innerHTML = "";
});


// Common Portion....
const toDo = document.querySelector('.todo');
const cal = document.querySelector('#calendar');
const mindMap = document.getElementById('mindmap');

document.querySelector('#todo-btn').addEventListener('click',()=>{
    cal.classList.add('hide');
    mindMap.classList.add('hide');
    toDo.classList.remove('hide');
    document.querySelector('#todo-btn').classList.add('bg-color');
    document.querySelector('#calendar-btn').classList.remove('bg-color');
    document.querySelector('#mindmap-btn').classList.remove('bg-color');
});

document.querySelector('#calendar-btn').addEventListener('click',()=>{
    toDo.classList.add('hide');
    cal.classList.remove('hide');
    mindMap.classList.add('hide');
    document.querySelector('#calendar-btn').classList.add('bg-color');
    document.querySelector('#todo-btn').classList.remove('bg-color');
    document.querySelector('#mindmap-btn').classList.remove('bg-color');
});

document.querySelector('#mindmap-btn').addEventListener('click',()=>{
    toDo.classList.add('hide');
    cal.classList.add('hide');
    mindMap.classList.remove('hide');
    document.querySelector('#mindmap-btn').classList.add('bg-color');
    document.querySelector('#todo-btn').classList.remove('bg-color');
    document.querySelector('#calendar-btn').classList.remove('bg-color');
});
