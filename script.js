// 1. 페이지 로드 시 localStorage에서 시간표 불러오기
document.addEventListener('DOMContentLoaded', loadSchedule);

// 2. DOM이 완전히 로드된 후 '추가' 버튼에 리스너 연결
document.addEventListener('DOMContentLoaded', () => {
    // HTML에서 id="addButton"을 가진 버튼을 찾습니다.
    const addButton = document.getElementById('addButton');
    
    // 버튼이 존재하는지 확인하고, 클릭 이벤트를 연결합니다.
    if (addButton) {
        addButton.addEventListener('click', addSchedule);
    } else {
        // 이 메시지가 콘솔에 보이면 HTML의 ID가 잘못된 것입니다.
        console.error("오류: ID 'addButton'을 가진 버튼을 찾을 수 없습니다. HTML을 확인하세요.");
    }
});

function getSavedSchedule() {
    // localStorage에서 데이터를 가져와 JSON 객체로 변환, 없으면 빈 배열 반환
    return JSON.parse(localStorage.getItem('dailySchedule')) || [];
}

function saveSchedule(schedule) {
    // 시간표 목록을 JSON 문자열로 변환하여 localStorage에 저장
    localStorage.setItem('dailySchedule', JSON.stringify(schedule));
}

// 시간표 항목을 시간 순서대로 정렬하여 화면에 표시
function renderSchedule(schedule) {
    // 시간(HH:MM)을 기준으로 정렬
    schedule.sort((a, b) => a.time.localeCompare(b.time));

    const list = document.getElementById('scheduleList');
    list.innerHTML = ''; // 기존 목록 초기화

    schedule.forEach(item => {
        createScheduleElement(item.time, item.activity);
    });
}

function loadSchedule() {
    const savedSchedule = getSavedSchedule();
    renderSchedule(savedSchedule);
}

// 새로운 시간표 항목 DOM 생성 및 리스트에 추가
function createScheduleElement(time, activity) {
    const list = document.getElementById('scheduleList');
    const listItem = document.createElement('li');

    listItem.innerHTML = `
        <span class="time-slot">${time}</span>
        <span class="activity-content">${activity}</span>
        <span class="delete" onclick="deleteSchedule(this)">❌</span>
    `;
    list.appendChild(listItem);
}

// 현재 리스트에서 시간표 데이터를 추출하여 저장소에 업데이트
function updateScheduleInStorage() {
    const list = document.getElementById('scheduleList');
    const listItems = list.querySelectorAll('li');
    const currentSchedule = [];

    listItems.forEach(item => {
        const time = item.querySelector('.time-slot').textContent;
        const activity = item.querySelector('.activity-content').textContent;
        currentSchedule.push({ time, activity });
    });

    saveSchedule(currentSchedule);
}

function addSchedule() {
    const timeInput = document.getElementById('timeInput');
    const activityInput = document.getElementById('activityInput');
    
    const time = timeInput.value.trim();
    const activity = activityInput.value.trim();

    if (time === '' || activity === '') {
        alert('시간과 활동 내용을 모두 입력하세요.');
        return;
    }
    
    // 현재 저장된 시간표를 가져와 새 항목 추가
    const currentSchedule = getSavedSchedule();
    currentSchedule.push({ time, activity });
    
    // 저장 후 다시 렌더링 (자동 정렬 포함)
    saveSchedule(currentSchedule);
    renderSchedule(currentSchedule); 

    // 입력 필드 초기화
    timeInput.value = '';
    activityInput.value = '';
}

function deleteSchedule(element) {
    const listItem = element.parentElement;
    listItem.remove();
    
    // DOM에서 삭제 후, 저장소 데이터도 업데이트 및 정렬
    updateScheduleInStorage();
    loadSchedule(); // 정렬된 상태로 다시 불러오기
}
