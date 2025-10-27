// 페이지 로드 시 localStorage에서 할 일 불러오기
document.addEventListener('DOMContentLoaded', loadTodos);

function saveTodos(todos) {
    // 할 일 목록을 문자열로 변환하여 localStorage에 저장
    localStorage.setItem('plannerTodos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('plannerTodos')) || [];
    const list = document.getElementById('todoList');
    list.innerHTML = ''; // 기존 목록 초기화

    todos.forEach(todoText => {
        createTodoElement(todoText);
    });
}

function createTodoElement(todoText) {
    const list = document.getElementById('todoList');
    const listItem = document.createElement('li');

    // 할 일 텍스트 및 삭제 버튼 추가
    listItem.innerHTML = todoText + ' <span class="delete" onclick="deleteTodo(this)">❌</span>';
    list.appendChild(listItem);
}


function addTodo() {
    const input = document.getElementById('todoInput');
    const todoText = input.value.trim();

    if (todoText === '') {
        alert('할 일을 입력하세요.');
        return;
    }

    createTodoElement(todoText);
    
    // 할 일 추가 후 저장
    saveCurrentTodos();
    
    input.value = ''; // 입력 필드 초기화
}

function deleteTodo(element) {
    const listItem = element.parentElement;
    listItem.remove();
    
    // 할 일 삭제 후 저장
    saveCurrentTodos();
}

function saveCurrentTodos() {
    const list = document.getElementById('todoList');
    const listItems = list.querySelectorAll('li');
    const currentTodos = [];

    listItems.forEach(item => {
        // '❌' 버튼 텍스트를 제외하고 순수한 할 일 텍스트만 저장합니다.
        const text = item.firstChild.textContent.trim();
        currentTodos.push(text);
    });

    saveTodos(currentTodos);
}
