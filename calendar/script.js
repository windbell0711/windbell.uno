
// 备忘录数据 (格式: YYYY-MM-DD)
const memos = {
    "2026-06-13": ["aa", "今日任务：完成日历项目开发\n测试暗黑主题样式\n检查跨浏览器兼容性"],
    "2026-06-20": ["bb", "朋友生日聚餐"],
    "2026-08-01": ["cc", "健身目标检查点"],
    "2026-08-12": ["dd", "阅读《JavaScript高级程序设计》第10章"]
};

const startDate = new Date(2026, 5, 1);  // 6.1
const endDate   = new Date(2026, 6, 30); // 7.30

const dayHeaders = document.getElementById('dayHeaders');
const calendarDaysScroll = document.getElementById('calendarDaysScroll');
const memoContentElement = document.getElementById('memoContent');

// 添加星期标题
const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
weekdays.forEach(day => {
    const headerCell = document.createElement('p');
    headerCell.className = 'day-header';
    headerCell.textContent = day;
    dayHeaders.appendChild(headerCell);
});

// 渲染日历
let currentDate = new Date(startDate);
while (currentDate <= endDate) {
    for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';

        const dayNumberSpan = document.createElement('span');
        dayNumberSpan.className = 'day-number';
        dayNumberSpan.textContent = currentDate.getDate() == 1 ? `${currentDate.getMonth()+1}/${currentDate.getDate()}` : currentDate.getDate();
        dayCell.appendChild(dayNumberSpan);

        const cellDate = new Date(currentDate);  // 闭包陷阱
        const dateString = cellDate.toISOString().split('T')[0];
        if (memos[dateString]) {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'memo-preview';
            previewDiv.textContent = memos[dateString][0];
            dayCell.appendChild(previewDiv);
        }

        // 添加点击事件
        dayCell.addEventListener('click', () => {
            // Remove selected class from all cells
            document.querySelectorAll('.calendar-day').forEach(cell => {
                cell.classList.remove('selected');
            });
            // Add selected class to clicked cell
            dayCell.classList.add('selected');

            const clickedDateString = cellDate.toISOString().split('T')[0];
            const clickedMemo = memos[clickedDateString];

            if (clickedMemo) {
                memoContentElement.textContent = clickedMemo;
                memoContentElement.classList.remove('no-memo');
            } else {
                memoContentElement.innerHTML = `<span class="no-memo">(${clickedDateString}) 暂无备忘录</span>`;
            }
        });

        calendarDaysScroll.appendChild(dayCell);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}