function displayDriveCards(files) {
    const centerContainer = document.querySelector('#drive-column .center-container-gen-drive');

    files.forEach(file => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'google-drive-card';

        cardContainer.innerHTML = `
            <div class="card-content">
                <img src="${file.imgSrc}" alt="${file.title}">
                <div class="card-details">
                    <p class="drive-file-name">${file.title}</p>
                    <p class="drive-file-type">${file.type}</p>
                    <p class="drive-file-description">${file.description}</p>
                </div>
            </div>
            <div class="card-footer">
                <a href="${file.url}" target="_blank" style="color: var(--white);">Download</a>
            </div>
        `;

        centerContainer.appendChild(cardContainer);
    });
}