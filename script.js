document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const colorPicker = document.getElementById('color-picker');
    const prioritySelect = document.getElementById('priority-select');
    const taskList = document.getElementById('task-list');
    const downloadLink = document.getElementById('download-link');

    // Cargar tareas desde localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.text, task.color, task.priority));

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskColor = colorPicker.value;
        const taskPriority = prioritySelect.value;

        if (taskText) {
            addTask(taskText, taskColor, taskPriority);
            taskInput.value = '';
            colorPicker.value = '#CC66FF'; // Reset color picker
            prioritySelect.value = 'baja'; // Reset priority select
        } else {
            alert('Por favor, ingresa una tarea.');
        }
    });

    function addTask(taskText, color, priority) {
        const li = document.createElement('li');
        li.classList.add(priority);

        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-text';
        taskDiv.textContent = taskText;
        taskDiv.style.backgroundColor = color;

        const colorRgb = hexToRgb(color);
        const textColor = getTextColor(colorRgb);
        taskDiv.style.color = textColor;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', function () {
            li.remove();
            removeTaskFromLocalStorage(taskText, color, priority);
        });

        li.appendChild(taskDiv);
        li.appendChild(deleteButton);
        taskList.appendChild(li);

        saveTasksToLocalStorage();
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function getTextColor(rgb) {
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return luminance > 0.5 ? 'black' : 'white';
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('.task-text').textContent,
            color: li.querySelector('.task-text').style.backgroundColor,
            priority: li.classList[0] // Get the priority class
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskText, color, priority) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => !(task.text === taskText && task.color === color && task.priority === priority));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    downloadLink.addEventListener('click', function () {
        const tasksToDownload = tasks.map(task => ({
            tarea: task.text,
            color: task.color
        }));

        // Enviar datos por AJAX (método POST)
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'descargar_tareas.php');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (xhr.status === 200) {
                const url = URL.createObjectURL(xhr.response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lista_tareas.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Error al descargar la lista de tareas.');
            }
        };

        // Enviar datos en formato JSON
        xhr.send(JSON.stringify(tasksToDownload));
    });
});
