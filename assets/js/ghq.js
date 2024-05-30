async function checkRateLimit(repoConfigs) {
    try {
        const response = await fetch('https://api.github.com/rate_limit');
        const data = await response.json();

        if (data.resources.core.remaining > 0) {
            repoConfigs.forEach(config => fetchGitHubRepo(config.url, config.title, config.description, config.type));
        } else {
            repoConfigs.forEach(config => displayManualCard(config.title, config.description, config.url, config.type));
        }
    } catch (error) {
        console.error('Error checking rate limit:', error);
        repoConfigs.forEach(config => displayManualCard(config.title, config.description, config.url, config.type));
    }
}

function getCachedData(key) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        const { data, expiry } = JSON.parse(cachedData);
        if (expiry > Date.now()) {
            return data;
        }
    }
    return null;
}

function setCachedData(key, data, ttl = 3600) {
    const expiry = Date.now() + ttl * 1000;
    const cachedData = { data, expiry };
    localStorage.setItem(key, JSON.stringify(cachedData));
}

async function fetchGitHubRepo(repoUrl, title, description, type) {
    const cacheKey = `github_repo_${repoUrl}`;
    const cachedRepoData = getCachedData(cacheKey);
    const cachedUserData = getCachedData(`${cacheKey}_user`);

    if (cachedRepoData && cachedUserData) {
        displayRepoCard(cachedRepoData, cachedUserData, title, description, type);
        return;
    }

    try {
        const response = await fetch(repoUrl);
        const repoData = await response.json();
        setCachedData(cacheKey, repoData);

        const userResponse = await fetch(repoData.owner.url);
        const userData = await userResponse.json();
        setCachedData(`${cacheKey}_user`, userData);

        displayRepoCard(repoData, userData, title, description, type);
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        displayManualCard(title, description, repoUrl, type);
    }
}

function displayGitHubCard(repoData, userData) {
    const githubCard = document.getElementById('github-card');

    githubCard.innerHTML = `
    <a href="${repoData.html_url}" target="_blank" style="text-decoration: none; color: inherit;">
        <div class="card-header">GitHub Repo</div>
        <div class="card-content">
            <img src="${userData.avatar_url}" alt="${userData.login}'s avatar">
            <div class="card-details">
                <p class="repo-name">${repoData.name}</p>
                <p class="author-name">by ${userData.login}</p>
                <p class="repo-description">${repoData.description}</p>
            </div>
        </div>
    </a>
  `;
}

function displayRepoCard(repoData, userData, title, description, type) {
    const centerContainer = document.querySelector('#repo-column .center-container-gen') || document.querySelector('.center-container-gen');

    const cardContainer = document.createElement('div');
    cardContainer.className = 'drac-app-container';

    cardContainer.innerHTML = `
        <div class="top-section">
            <div class="top-bar ${type.toLowerCase()}-gradient">
                <div class="type-text">${type}</div>
            </div>
            <div class="top-text-white">${title}</div>
        </div>
        <div class="bottom-section">
            <div class="manual-card">
                <h2>${title}</h2>
                <p>Description: ${description}</p>
            </div>
            <div class="github-card streamlined-card">
                <a href="${repoData.html_url}" target="_blank" style="text-decoration: none; color: inherit;">
                    <div class="streamlined-card-header">${repoData.name}</div>
                    <div class="streamlined-card-content">
                        <div class="streamlined-card-details">
                            <p class="streamlined-repo-name">${repoData.name}</p>
                            <p class="streamlined-author-name">by ${userData.login}</p>
                            <p class="repo-description">${repoData.description}</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    `;

    cardContainer.querySelector('.github-card').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${userData.avatar_url})`;
    cardContainer.querySelector('.github-card').style.backgroundSize = 'cover';
    cardContainer.querySelector('.github-card').style.backgroundPosition = 'center';

    centerContainer.appendChild(cardContainer);
}

function displayManualCard(title, description, repoUrl, type) {
    const centerContainer = document.querySelector('#repo-column .center-container-gen') || document.querySelector('.center-container-gen');

    const cardContainer = document.createElement('div');
    cardContainer.className = 'drac-app-container';

    cardContainer.innerHTML = `
        <div class="top-section">
            <div class="top-bar ${type.toLowerCase()}-gradient">
                <div class="type-text">${type}</div>
            </div>
            <div class="top-text-white">${title}</div>
        </div>
        <div class="bottom-section">
            <div class="manual-card">
                <h2>${title}</h2>
                <p>Description: ${description}</p>
                <p><a href="${repoUrl.replace('api.github.com/repos', 'github.com')}" target="_blank" style="color: var(--green);">GitHub Repo</a></p>
            </div>
        </div>
    `;

    centerContainer.appendChild(cardContainer);
}
