const linkList = document.getElementById('link-list');
const titleContainer = document.getElementById('title-container');
const titleElement = document.getElementById('title');
const editTitleButton = document.getElementById('edit-title-button');

let isTitleEditMode = false;

function saveLinksToLocalStorage(links) {
    localStorage.setItem('links', JSON.stringify(links));
}

function fetchLinksAndSaveToLocalStorage(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received from server:', data);
            saveLinksToLocalStorage(data); // Save the entire array to local storage
            renderLinks(); // Render the links after saving to local storage
        })
        .catch(error => {
            console.error('Error fetching links:', error);
        });
}

function handleEditButtonClick(link, listItem) {
    return function() {
        link.editMode = !link.editMode; // Toggle edit mode
        renderLinks(); // Re-render the links after toggling edit mode
    };
}

function attachEventListeners() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach((editButton, index) => {
        const link = links[index];
        const listItem = editButton.parentElement;
        editButton.addEventListener('click', handleEditButtonClick(link, listItem));
    });

    const saveButtons = document.querySelectorAll('.save-button');
    saveButtons.forEach((saveButton, index) => {
        const link = links[index];
        saveButton.addEventListener('click', () => {
            // Save changes
            link.name = link.nameInput.value;
            link.url = link.urlInput.value;
            link.editMode = false; // Exit edit mode
            saveLinksToLocalStorage(links); // Update local storage
            renderLinks(); // Re-render the links after saving
        });
    });
}

function renderLinks() {
    linkList.innerHTML = ''; // Clear existing content before rendering
    const links = JSON.parse(localStorage.getItem('links')) || []; // Retrieve links from local storage

    links.forEach((link, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center space-x-4 justify-center';

        const linkName = document.createElement('a');
        linkName.href = link.url;
        linkName.textContent = link.name;

        const linkNameInput = document.createElement('input');
        linkNameInput.type = 'text';
        linkNameInput.value = link.name;
        linkNameInput.className = 'border p-1 rounded w-full hidden';
        linkNameInput.placeholder = 'Link Name';

        const linkUrlInput = document.createElement('input');
        linkUrlInput.type = 'text';
        linkUrlInput.value = link.url;
        linkUrlInput.className = 'border p-1 rounded w-full hidden';
        linkUrlInput.placeholder = 'Enter URL..';

        if (link.editMode) {
            linkName.classList.add('hidden');
            linkNameInput.classList.remove('hidden');
            linkUrlInput.classList.remove('hidden');
        } else {
            linkName.classList.remove('hidden');
            linkNameInput.classList.add('hidden');
            linkUrlInput.classList.add('hidden');
        }


        const editButton = document.createElement('button');
        editButton.className = 'icon-button edit-button';
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
        `;

        const saveButton = document.createElement('button');
        saveButton.className = 'icon-button save-button'; // Save button is always shown
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
                <path d="M11 2H9v3h2z"/>
                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
            </svg>
        `;
        saveButton.style.display = link.editMode ? 'block' : 'none'; // Show save button when in edit mode

        const deleteButton = document.createElement('button');
        deleteButton.className = 'icon-button ml-2 hidden';
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <!-- SVG path here -->
            </svg>
        `;

        listItem.appendChild(linkName);
        listItem.appendChild(linkNameInput);
        listItem.appendChild(linkUrlInput);
        listItem.appendChild(editButton);
        listItem.appendChild(saveButton); // Appending save button here
        listItem.appendChild(deleteButton);

        linkList.appendChild(listItem); // Append the list item to the link list
    });

    attachEventListeners(); // Attach event listeners after rendering links
}

// Assuming you have a URL from where to fetch the JSON data
const jsonDataURL = 'links.json';
fetchLinksAndSaveToLocalStorage(jsonDataURL); // Fetch the JSON data and save it to local storage