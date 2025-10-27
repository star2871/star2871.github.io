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
        console.error("오류: ID 'addButton'을 가진 버튼을 찾을 수 없습니다. HTML을 확인하세요.");
    }
});

// ----------------------------------------------------
// 시간 변환 헬퍼 함수
// ----------------------------------------------------

/**
 * 24시간 형식(HH:MM)을 한국어 오전/오후 형식(오전/오후 H:MM)으로 변환합니다.
 * @param {string} time24 - 'HH:MM' 형식의 시간 문자열 (예: '14:30').
 * @returns {string} '오전/오후 H:MM' 형식의 시간 문자열 (예: '오후 2:30').
 */
function convertToAmPm(time24) {
    if (!time24 || time24.length !== 5) return time24;

    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    
    let ampm = '오전';

    // 0시 (자정)는 12 AM으로, 12시 (정오)는 12 PM으로 처리
    if (hour >= 12) {
        ampm = '오후';
    }

    if (hour === 0) {
        hour = 12; // 00:xx -> 12 AM
    } else if (hour > 12) {
        hour -= 12; // 13:xx -> 1 PM
    }
    
    return `${ampm} ${hour}:${minute}`;
}

// ----------------------------------------------------
// 시간표 데이터 관리
// ----------------------------------------------------

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
    // 저장된 24시간 형식('HH:MM')을 기준으로 정렬
    schedule.sort((a, b) => a.time.localeCompare(b.time));

    const list = document.getElementById('scheduleList');
    list.innerHTML = ''; // 기존 목록 초기화

    schedule.forEach(item => {
        // createScheduleElement에 24시간 형식의 time을 전달
        createScheduleElement(item.time, item.activity);
    });
}

function loadSchedule() {
    const savedSchedule = getSavedSchedule();
    renderSchedule(savedSchedule);
}

// 새로운 시간표 항목 DOM 생성 및 리스트에 추가
function createScheduleElement(time24, activity) {
    const list = document.getElementById('scheduleList');
    const listItem = document.createElement('li');

    // 24시간을 오전/오후로 변환하여 표시 (사용자에게 보이는 부분)
    const timeDisplay = convertToAmPm(time24); 

    listItem.innerHTML = `
        <span class="time-slot" data-time-24="${time24}">${timeDisplay}</span>
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
        // DOM에서 24시간 형식의 time을 다시 추출하여 저장소에 넣어야 정렬이 유지됩니다.
        const time = item.querySelector('.time-slot').textContent; 
        const activity = item.querySelector('.activity-content').textContent;
        currentSchedule.push({ time, activity });
    });

    saveSchedule(currentSchedule);
}

function addSchedule() {
    const timeInput = document.getElementById('timeInput');
    const activityInput = document.getElementById('activityInput');
    
    const time = timeInput.value.trim(); // 24시간 형식 (예: 14:30)
    const activity = activityInput.value.trim();

    if (time === '' || activity === '') {
        alert('시간과 활동 내용을 모두 입력하세요.');
        return;
    }
    
    // 현재 저장된 시간표를 가져와 새 항목 추가 (24시간 형식으로 저장)
    const currentSchedule = getSavedSchedule();
    currentSchedule.push({ time, activity });
    
    // 저장 후 다시 렌더링 (자동 정렬 및 AM/PM 변환 포함)
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
