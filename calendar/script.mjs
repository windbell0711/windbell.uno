import { fetchData } from '/calendar/data.mjs';

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const startDate = new Date(2026, 5, 1);  // 6.1
const endDate   = new Date(2026, 6, 30); // 7.30

const dayHeaders = document.getElementById('dayHeaders');
const calendarDaysScroll = document.getElementById('calendarDaysScroll');
const memoContentElement = document.getElementById('memoContent');

// 备忘录数据 (格式: YYYY-MM-DD)
const memos = await fetchData();
// console.log(memos);

// 添加星期标题
const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
weekdays.forEach(day => {
    const headerCell = document.createElement('p');
    headerCell.className = 'day-header';
    headerCell.textContent = day;
    dayHeaders.appendChild(headerCell);
});

// 渲染日历
const today = formatDate(new Date());
let currentDate = new Date(startDate);
while (currentDate <= endDate) {
    for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement('div');

        const dayNumberSpan = document.createElement('span');
        dayNumberSpan.className = 'day-number';
        dayNumberSpan.textContent = currentDate.getDate() == 1 ? `${currentDate.getMonth()+1}/${currentDate.getDate()}` : currentDate.getDate();
        dayCell.appendChild(dayNumberSpan);

        const cellDate = new Date(currentDate);  // 闭包陷阱
        const dateString = formatDate(cellDate);

        if (memos[dateString] && memos[dateString]['label'] != 'normal')
            dayCell.className = 'calendar-day-special';
        else
            dayCell.className = 'calendar-day';

        if (memos[dateString]) {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'memo-preview';
            previewDiv.textContent = memos[dateString]['summary'];
            dayCell.appendChild(previewDiv);
        }
        
        // 添加点击事件
        dayCell.addEventListener('click', () => {
            // Remove selected class from all cells
            document.querySelectorAll('.calendar-day, .calendar-day-special').forEach(cell => {
                cell.classList.remove('selected');
            });
            // Add selected class to clicked cell
            dayCell.classList.add('selected');

            const clickedDateString = formatDate(cellDate);
            const clickedMemo = memos[clickedDateString];

            if (clickedMemo) {
                let para = `${clickedDateString}  ${weekdays[i]}`;
                if (clickedMemo['label'] == 'busy') para += `<p class="label-busy">Busy</p>`;
                else if (clickedMemo['label'] == 'important') para += `<p class="label-important">Important</p>`;
                if (clickedMemo['proj'])  para += `<p>Working on: ${clickedMemo['proj']}</p>`;
                if (clickedMemo['tech'])  para += `<p>Breakthrough: ${clickedMemo['tech']}</p>`;
                if (clickedMemo['other']) para += `<p>Other: ${clickedMemo['other']}</p>`;
                if (clickedMemo['pwq']) para += `<p>${clickedMemo['pwq']}</p>`;
                memoContentElement.innerHTML = para;
            } else {
                memoContentElement.innerHTML = `<span class="no-memo">(${clickedDateString}) 暂无记录</span>`;
            }
        });

        if (dateString == today) {
            dayCell.click();
        }

        calendarDaysScroll.appendChild(dayCell);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}