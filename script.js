// Функция для получения данных из локального хранилища
function getStoredData() { // Объявление функции getStoredData без параметров.
            // Получаем данные из локального хранилища по ключу taskPlannerData и сохранение их в переменную storedData.
            // Ключ - уникальное имя, по которому данные будут сохранены в локальном хранилище браузера
            const storedData = localStorage.getItem('taskPlannerData');
            // Если данные существуют, преобразуем их из строки JSON в объект, иначе возвращаем объект с пустыми списками
            // Если storedData существует (не является null или undefined), то преобразуем строку JSON в объект с помощью JSON.parse(storedData).
            // JSON(JavaScript Object Notation) - простой способ представления (обмена) структурных данных, таких как объекты и массивы, в виде текста. 
            return storedData ? JSON.parse(storedData) : { // В противном случае возвращаем объект с тремя пустыми списками (active, completed, deleted).
                active: [],
                completed: [],
                deleted: []
            };
        }
        // Функция для сохранения данных в локальное хранилище
        function saveDataToStorage(data) {
        // Объявление функции saveDataToStorage с одним параметром data, который является объектом данных для сохранения.
            localStorage.setItem('taskPlannerData', JSON.stringify(data));
            // Использование метода localStorage.setItem для сохранения данных в локальное хранилище браузера.
            // Первый аргумент 'taskPlannerData' представляет ключ, по которому данные будут сохранены.
            // Второй аргумент JSON.stringify(data) преобразует объект данных в строку JSON перед сохранением.
        }
        // Функция для обновления списков задач на странице
        function updateTaskLists(data) {
            // Получаем ссылки на контейнеры задач по их идентификаторам
            const activeTasks = document.getElementById('activeTasks');
            const completedTasks = document.getElementById('completedTasks');
            const deletedTasks = document.getElementById('deletedTasks');
            // Очищаем содержимое контейнеров задач
            activeTasks.innerHTML = '';
            completedTasks.innerHTML = '';
            deletedTasks.innerHTML = '';
            // Заполняем каждый контейнер задач соответствующими данными из объекта data
            data.active.forEach(task => appendTask(activeTasks, task, 'completed-btn', 'Выполнено'));
            data.completed.forEach(task => appendTask(completedTasks, task, 'restore-btn', 'Восстановить'));
            data.deleted.forEach(task => appendTask(deletedTasks, task, 'restore-btn', 'Восстановить', 'delete-forever-btn', 'Удалить навсегда'));
        }
        // Функция для добавления задачи в контейнер
        function appendTask(container, taskText, buttonClass, buttonText, deleteButtonClass, deleteButtonText) {
        //Объявление функции appendTask с несколькими параметрами, предназначенными для настройки создаваемой задачи и её добавления в контейнер.
            // Создание нового элемента списка (<li>), который будет представлять собой задачу.
            const listItem = document.createElement('li');
            // Заполняем содержимое элемента списка HTML-разметкой с использованием строкового шаблона
            // HTML-разметка для задачи с использованием строкового шаблона 
            listItem.innerHTML = `
        <div class="task">
          <span>${taskText}</span>
          <!-- Создаем кнопку с классом и обработчиком события, в зависимости от переданного buttonClass -->
          <button class="${buttonClass}" onclick="${buttonClass === 'completed-btn' ? 'completeTask' : 'restoreTask'}(this)">${buttonText}</button>
          <!-- Создаем кнопку корзину для мусора с обработчиком события deleteTask -->
          <button class="trash" onclick="deleteTask(this)">🗑️</button>
          <!-- Условно создаем кнопку для удаления навсегда, если переданы соответствующие аргументы -->
          ${deleteButtonClass ? `<button class="${deleteButtonClass}" onclick="deleteForever(this)">${deleteButtonText}</button>` : ''}
        </div>
      `;
            // Добавляем созданный элемент списка в переданный контейнер
            container.appendChild(listItem);
        }
        // Функция для добавления новой задачи
        function addTask() {
            // Получаем ссылку на поле ввода для задачи
            const taskInput = document.getElementById('taskInput');
            // Получаем текст задачи из поля ввода и удаляем лишние пробелы по краям
            const taskText = taskInput.value.trim();
            // Проверяем, что текст задачи не является пустой строкой
            if (taskText === '') return;
            // Получаем текущие данные о задачах из локального хранилища
            const data = getStoredData();
            // Добавляем новую активную задачу в массив активных задач
            data.active.push(taskText);
            // Сохраняем обновленные данные в локальное хранилище
            saveDataToStorage(data);
            // Обновляем отображение списков задач на странице
            updateTaskLists(data);
            // Очищаем поле ввода после добавления задачи
            taskInput.value = '';
        }
        // Функция для завершения задачи
        function completeTask(btn) {
            // Получаем родительский элемент с классом 'task' от кнопки, по которой было совершено действие
            const task = btn.closest('.task');
            // Получаем текст задачи из элемента span внутри задачи
            const taskText = task.querySelector('span').textContent;
            // Получаем текущие данные о задачах из локального хранилища
            const data = getStoredData();
            // Исключаем завершенную задачу из массива активных задач
            data.active = data.active.filter(t => t !== taskText);
            // Добавляем завершенную задачу в массив завершенных задач
            data.completed.push(taskText);
            // Сохраняем обновленные данные в локальное хранилище
            saveDataToStorage(data);
            // Обновляем отображение списков задач на странице
            updateTaskLists(data);
        }
        // Функция для восстановления завершенной задачи
        function restoreTask(btn) {
            // Получаем родительский элемент с классом 'task' от кнопки, по которой было совершено действие
            const task = btn.closest('.task');
            // Получаем текст задачи из элемента span внутри задачи
            const taskText = task.querySelector('span').textContent;
            // Получаем текущие данные о задачах из локального хранилища
            const data = getStoredData();
            // Исключаем восстановленную задачу из массива завершенных задач
            data.completed = data.completed.filter(t => t !== taskText);
            // Добавляем восстановленную задачу в массив активных задач
            data.active.push(taskText);
            // Сохраняем обновленные данные в локальное хранилище
            saveDataToStorage(data);
            // Обновляем отображение списков задач на странице
            updateTaskLists(data);
        }
        // Функция для удаления активной задачи
        function deleteTask(btn) {
            const task = btn.closest('.task');
            const taskText = task.querySelector('span');
            const data = getStoredData();
            if (data.active.includes(taskText.textContent)) {
            // Если задача активна, исключаем ее из массива активных задач
                data.active = data.active.filter(t => t !== taskText.textContent);
            }
            else if (data.completed.includes(taskText.textContent)) {
            // Если задача завершена, исключаем ее из массива завершенных задач
                data.completed = data.completed.filter(t => t !== taskText.textContent);
            }
            // В любом случае добавляем задачу в массив удаленных задач
            data.deleted.push(taskText.textContent);
            // Перечеркиваем текст задачи
            taskText.style.textDecoration = 'line-through';
            saveDataToStorage(data);
            updateTaskLists(data);
        }

        // Функция для удаления задачи навсегда
        function deleteForever(btn) {
            // Получаем родительский элемент с классом 'task' от кнопки, по которой было совершено действие
            const task = btn.closest('.task');
            // Получаем текст задачи из элемента span внутри задачи
            const taskText = task.querySelector('span').textContent;
            // Получаем текущие данные о задачах из локального хранилища
            const data = getStoredData();
            data.deleted = data.deleted.filter(t => t !== taskText);

            saveDataToStorage(data);
            updateTaskLists(data);
        }
        // Функция для изменения отображаемого раздела задач
        function changeSection() {
            // Получаем значение выбранного раздела из выпадающего списка
            const selectedSection = document.getElementById('sectionSelector').value;
            // Получаем текущие данные о задачах из локального хранилища
            const data = getStoredData();
            // Скрываем все контейнеры для задач
            document.getElementById('activeTasksContainer').style.display = 'none';
            document.getElementById('completedTasksContainer').style.display = 'none';
            document.getElementById('deletedTasksContainer').style.display = 'none';
            // В зависимости от выбранного раздела, отображаем соответствующий контейнер и обновляем список задач
            switch (selectedSection) {
                case 'active':
                    document.getElementById('activeTasksContainer').style.display = 'block';
                    updateTaskList('activeTasks', data.active, 'completed-btn', 'Выполнено');
                    break;
                case 'completed':
                    document.getElementById('completedTasksContainer').style.display = 'block';
                    updateTaskList('completedTasks', data.completed, 'restore-btn', 'Восстановить');
                    break;
                case 'deleted':
                    document.getElementById('deletedTasksContainer').style.display = 'block';
                    updateTaskList('deletedTasks', data.deleted, 'restore-btn', 'Восстановить', 'delete-forever-btn', 'Удалить навсегда');
                    break;
            }
        }
        // Функция для обновления списка задач в указанном контейнере
        function updateTaskList(containerId, tasks, buttonClass, buttonText, deleteButtonClass, deleteButtonText) {
            // Получаем ссылку на контейнер для задач по его идентификатору
            const container = document.getElementById(containerId);
            // Получаем ссылку на список задач внутри контейнера
            const taskList = container.querySelector('.task-list');
            // Очищаем содержимое списка задач перед обновлением
            taskList.innerHTML = '';
            // Для каждой задачи в массиве задач вызываем функцию appendTask для добавления ее в список
            tasks.forEach(task => {
                appendTask(taskList, task, buttonClass, buttonText, deleteButtonClass, deleteButtonText);
            });
        }
        // Обработчик события, срабатывающий после полной загрузки документа
        document.addEventListener('DOMContentLoaded', function () {
            // Получаем текущие данные о задачах из локального хранилища
            const data = getStoredData();
            // Обновляем списки задач на странице в соответствии с полученными данными
            updateTaskLists(data);
        });
        // Функция для генерации снежинок
        function generateSnowflakes() {
            // Получаем ссылку на контейнер для снежинок по его классу
            const snowflakesContainer = document.querySelector('.snowflakes');
            // Создаем 20 снежинок и добавляем их в контейнер
            for (let i = 0; i < 20; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                // Устанавливаем случайные значения для позиции и продолжительности анимации
                snowflake.style.left = `${Math.random() * 100}vw`;
                snowflake.style.animationDuration = `${Math.random() * 2 + 1}s`;

                snowflakesContainer.appendChild(snowflake);
            }
        }
        // Обработчик события, срабатывающий после полной загрузки документа
        document.addEventListener('DOMContentLoaded', function () {
            // Генерируем снежинки при загрузке страницы
            generateSnowflakes();
        });

                // Функция для удаления всех задач
function deleteAllTasks() {
    const data = getStoredData();
    // Очищаем массивы задач
    data.active = [];
    data.completed = [];
    data.deleted = [];
    // Сохраняем обновленные данные в локальное хранилище
    saveDataToStorage(data);
    // Обновляем отображение списков задач на странице
    updateTaskLists(data);
}
// Функция для сортировки задач по алфавиту
function sortTasks() {
    const data = getStoredData();
    // Сортируем массивы задач по алфавиту
    data.active.sort();
    data.completed.sort();
    data.deleted.sort();
    // Сохраняем обновленные данные в локальное хранилище
    saveDataToStorage(data);
    // Обновляем отображение списков задач на странице
    updateTaskLists(data);
}