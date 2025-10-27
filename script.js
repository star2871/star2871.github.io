function addTodo() {
    const input = document.getElementById('todoInput');
    const todoText = input.value.trim();

    if (todoText === '') {
        alert('할 일을 입력하세요.');
        return;
    }

    const list = document.getElementById('todoList');
    const listItem = document.createElement('li');

    // 할 일 텍스트 추가
    listItem.innerHTML = todoText + ' <span class="delete" onclick="deleteTodo(this)">❌</span>';

    list.appendChild(listItem);
    input.value = ''; // 입력 필드 초기화
}

function deleteTodo(element) {
    // ❌ 버튼의 부모 요소(li)를 찾아서 삭제합니다.
    const listItem = element.parentElement;
    listItem.remove();
}
