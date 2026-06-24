const config = {
    "user_name": "windbell0711",
    "recent_repo": "flchemist",
    "master_repos": [
        "BingGo2", "Vatrix-vbe-sm", "flchemist"
    ]
};
const BRANCH = 'main';
const COMMITS_COUNT = 5;

function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.getElementById('github-project-name').innerHTML = `Recent Github Project: <a href="https://github.com/${config.user_name}/${config.recent_repo}" target="_blank" rel="noopener noreferrer">${sanitize(config.recent_repo)}</a>`;
const commitsContainer = document.getElementById('commits');
const mastersContainer = document.getElementById('masters');


function formatDate(isoString) {
    const date = new Date(isoString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
            if (rateLimitRemaining === '0') {
                throw new Error('API请求次数已达上限，请稍后再试。');
            }
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
}

async function renderCommits() {
    let commits;
    try {
        commits = await fetchData(`https://api.github.com/repos/${config.user_name}/${config.recent_repo}/commits?sha=${BRANCH}&per_page=${COMMITS_COUNT}`);
    } catch (error) {
        console.error('获取commits失败:', error);
        commitsContainer.innerHTML = `<div class="error-message">⚠️ 获取 commit 信息失败：${sanitize(error.message || '网络错误')}</div>`;
        return;
    }
    if (!commits || commits.length === 0) {
        commitsContainer.innerHTML = '<div class="error-message">📭 暂无 commit 记录</div>';
        return;
    }
    let ret = '<ul class="items-list">\n';
    for(let commit of commits) {
        let com = commit.commit;
        const messageLines = com.message.split('\n');
        ret += `
            <li class="items">
                <p class="commit-title"><a href="${sanitize(commit.html_url)}" target="_blank" rel="noopener noreferrer">${sanitize(messageLines[0])}</a></p>
                <div>
                    <p class="commit-description">${messageLines.slice(1).filter(line => line.trim()).map(sanitize).join('</p><p class="commit-description">')}</p>
                </div>
                <span>
                    <p class="commit-time">${sanitize(formatDate(com.author?.date || ''))}</p>
                    <p class="commit-author">${sanitize(com.author?.name || 'Unknown')}</p>
                </span>
            </li>
        `;
    }
    ret += '</ul>\n';
    ret += `<p><a href="https://github.com/${config.user_name}/${config.recent_repo}/commits" target="_blank" rel="noopener noreferrer">More ...</a></p>`;
    commitsContainer.innerHTML = ret;
}

async function renderRepos() {
    let ret = '<ul class="items-list">\n';
    for(let repoName of config.master_repos) {
        let repo;
        try {
            repo = await fetchData(`https://api.github.com/repos/${config.user_name}/${repoName}`);
        } catch (error) {
            console.error('获取仓库信息失败:', error);
            ret += `<li class="error-message">⚠️ 获取${sanitize(repoName)}仓库信息失败：${sanitize(error.message || '网络错误')}</li>`;
            continue;
        }
        ret += `
            <li class="items">
                <p class="repo-name"><a href="https://github.com/${config.user_name}/${sanitize(repo.name)}" target="_blank" rel="noopener noreferrer">${sanitize(repo.name)}</a></p>
                <p class="repo-description">${sanitize(repo.description || 'No description provided.')}</p>
                <p class="repo-homepage">${sanitize(repo.homepage || '')}</p>
                <img src="https://img.shields.io/badge/stars-${repo.stargazers_count}-orange" alt="${repo.stargazers_count} Stars">
                <img src="https://img.shields.io/badge/forks-${repo.forks_count}-blue" alt="${repo.forks_count} Forks">
                <span>
                    <p class="repo-lang">${sanitize(repo.language || 'Unknown language')}</p>
                    <p class="repo-created">created at ${sanitize(formatDate(repo.created_at || ''))}</p>
                </span>
            </li>
        `;
    }
    ret += '</ul>';
    mastersContainer.innerHTML = ret;
}

(async () => {
    await renderCommits();
    await renderRepos();
})();
