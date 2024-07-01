const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

async function getFavicon(url) {
    try {
        const response = await fetch(CORS_PROXY + url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        let faviconUrl = doc.querySelector('link[rel="icon"]')?.href || doc.querySelector('link[rel="shortcut icon"]')?.href;

        if (!faviconUrl) {
            faviconUrl = new URL('/favicon.ico', url).href;
        }
        return faviconUrl;
    } catch (error) {
        console.error('Error fetching favicon:', error);
        return '';
    }
}

function displayLinks() {
    const links = JSON.parse(localStorage.getItem('links')) || [];
    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = '';

    const defaultSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>`;

    links.forEach((link, index) => {
        const linkHTML = `
        <div class="link-row" id="link-${index}">
            <a class="link-a" href="${link.url}" target="_blank">
                <img src="data:image/svg+xml;base64,${btoa(defaultSvg)}" alt="Favicon" class="favicon" id="favicon-${index}">
                ${link.name}
            </a>
            <button class="link-remove-button" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
        </div>
        `;
        linksContainer.innerHTML += linkHTML;
    });

    links.forEach(async (link, index) => {
        const favicon = await getFavicon(link.url);
        if (favicon) {
            document.getElementById(`favicon-${index}`).src = favicon;
        }
    });

    const removeButtons = document.querySelectorAll('.link-remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const indexToRemove = this.getAttribute('data-index');
            if (indexToRemove !== null) {
                const links = JSON.parse(localStorage.getItem('links')) || [];
                links.splice(indexToRemove, 1);
                localStorage.setItem('links', JSON.stringify(links));
                displayLinks();
                const editButton = document.getElementById('editLinks');
                editButton.classList.remove('edit-mode');
            }
        });
    });
}

function addLink() {
    const urlInput = document.getElementById('linkURL');
    let url = urlInput.value.trim();
    const nameInput = document.getElementById('linkName');
    const name = nameInput.value;

    if (url && name) {
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            if (!url.includes('www.')) {
                url = 'https://www.' + url;
            } else {
                url = 'https://' + url;
            }
        } else if (!url.includes('www.')) {
            const parts = url.split('://');
            url = parts[0] + '://www.' + parts[1];
        }

        const links = JSON.parse(localStorage.getItem('links')) || [];
        links.push({ url: url, name: name });
        localStorage.setItem('links', JSON.stringify(links));
        displayLinks();
    }
}

function loadForm() {
    const linksContainer = document.getElementById('linksContainer');
    const newLinkFormHTML = `
    <div class="new-link-form-row">
        <input id="linkName" placeholder="Link Text" class="input">
        <input id="linkURL" placeholder="Link URL" class="input">
        <button class="form-submit-button" id="linkSubmit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width=16 height=16 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
        </button>
    </div>
    `;
    linksContainer.innerHTML += newLinkFormHTML;
    const linkSubmitButton = document.getElementById('linkSubmit');
    linkSubmitButton.addEventListener('click', addLink);
}

function toggleEditMode() {
    const editButton = document.getElementById('editLinks');
    const removeButtons = document.querySelectorAll('.link-remove-button');

    if (editButton.classList.contains('edit-mode')) {
        editButton.classList.remove('edit-mode');
        removeButtons.forEach(element => {
            element.style.display = 'none';
        });
    } else {
        editButton.classList.add('edit-mode');
        removeButtons.forEach(element => {
            element.style.display = 'block';
        });
    }
}

const editButton = document.getElementById('editLinks');
editButton.addEventListener('click', toggleEditMode);

document.addEventListener('DOMContentLoaded', displayLinks);

const newLinkButton = document.getElementById('newLink');
newLinkButton.addEventListener('click', loadForm);
