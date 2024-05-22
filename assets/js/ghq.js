async function fetchGitHubRepo(repoUrl) {
  try {
    const response = await fetch(repoUrl);
    const repoData = await response.json();

    const userResponse = await fetch(repoData.owner.url);
    const userData = await userResponse.json();

    displayGitHubCard(repoData, userData);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
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