const REPO_OWNER = 'windbell0711';
const REPO_NAME = 'Vatrix-vbe-sm';
const BRANCH = 'main';
const COMMITS_COUNT = 3;

const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=${BRANCH}&per_page=${COMMITS_COUNT}`;

document.getElementById('github-project-name').innerHTML = `Recent Github Project: <a href="https://github.com/${REPO_OWNER}/${REPO_NAME}" target="_blank">${REPO_NAME}</a>`;
const container = document.getElementById('commits');


function formatDate(isoString) {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function renderCommits(commits) {
    if (!commits || commits.length === 0) {
        container.innerHTML = '<div class="error-message">📭 暂无 commit 记录</div>';
        return;
    }

    let ret = '<ul class="commits-list">\n';
    for(let commit of commits) {
        let com = commit.commit;
        const messageLines = com.message.split('\n');
        ret += `
            <li class="commit-item">
                <p class="commit-title">${messageLines[0]}</p>
                <div>
                    <p class="commit-description">${messageLines.slice(1).filter(line => line.trim()).join('<p/><p class="commit-description">')}</p>
                </div>
                <span>
                    <p class="commit-time">${formatDate(com.author?.date || '')}</p>
                    <img src="${com.author.avatar_url}" width="16" height="16" style="border-radius: 50%;" onerror="this.style.display='none'">
                    <p class="commit-author">${com.author?.name || 'Unknown'}</p>
                </span>
            </li>
        `;
    }
    ret += '</ul>';

    container.innerHTML = ret;
}

async function fetchCommits() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            if (response.status === 403) {
                const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
                if (rateLimitRemaining === '0') {
                    throw new Error('API请求次数已达上限，请稍后再试。');
                }
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        renderCommits(await response.json());
    } catch (error) {
        console.error('获取commits失败:', error);
        container.innerHTML = `<div class="error-message">⚠️ 获取 commit 信息失败：${error.message || '网络错误'}</div>`;
    }
}


fetchCommits();
