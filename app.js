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

    links.forEach((link, index) => {
        const linkHTML = `
        <div class="link-row" id="link-${index}">
            
            <a class="link-a" href="${link.url}" target="_blank"><img src="" alt="Favicon" class="favicon" id="favicon-${index}">${link.name}</a>
        </div>
        `;
        linksContainer.innerHTML += linkHTML;
    });

    links.forEach(async (link, index) => {
        const favicon = await getFavicon(link.url);
        document.getElementById(`favicon-${index}`).src = favicon;
    });
}

function addLink() {
    const urlInput = document.getElementById('url');
    const url = urlInput.value;
    const name = prompt("Enter the name for the link:");
    if (url && name) {
        const links = JSON.parse(localStorage.getItem('links')) || [];
        links.push({ url: url, name: name });
        localStorage.setItem('links', JSON.stringify(links));
        displayLinks();
    }
}

document.addEventListener('DOMContentLoaded', displayLinks);