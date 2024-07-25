editMode = false;

plusSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>`;

editSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg> 
`;

function setupTabListeners() {
    const tabsContainer = document.getElementById('tabs');
    const tabButtons = tabsContainer.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data');
            tabButtons.forEach(btn => {
                hideBtnData = btn.getAttribute('data');
                targetTabHide = document.querySelector(`[tabid="${hideBtnData}"]`);
                targetTabHide.style.display = 'none';
                btn.classList.remove('active');
            });

            this.classList.add('active');
            const targetTab = document.querySelector(`[tabid="${tabName}"]`);
            targetTab.style.display = 'block';
        });
    });
}

function loadTabs() {
    const main_array = JSON.parse(localStorage.getItem('linksArray')) || [];
    const tabsContainer = document.getElementById('tabs');
    const tabContents = document.getElementById('tabContents');
    const manageTabsContainer = document.getElementById('manageTabsContainer');

    tabsContainer.innerHTML = '';
    tabContents.innerHTML = '';
    manageTabsContainer.innerHTML = '';

    main_array.forEach((category, index) => {
        
        const tabButtonHTML = `
            <button class="tab-button${index === 0 ? ' active' : ''}" data="${category.name}" draggable="true" data-index="${index}">
                ${category.name}
            </button>
        `;

        const manageTabHTML = `
        
            <div class="manageTabsTab">
                <p>${category.name}</p>
                <button class="tab-remove-button" data-index="${index}" data-category="${category.name}">
                    &times;
                </button>
            </div>
        `;

        tabsContainer.innerHTML += tabButtonHTML;

        manageTabsContainer.innerHTML += manageTabHTML;
        
        const tabContentHTML = `
            <div class="frosted-glass tab" tabid="${category.name}" style="display: ${index === 0 ? 'block' : 'none'};">
                <div id="title-container" class="flex-center">
                    <h1 id="title" class="title">${category.name}</h1>
                </div>
                <div class="links-col" id="linksContainer-${category.name}"></div>
                <div class="modify-buttons-container">
                    <button class="modify-links-button add-links-button" data-tab="${category.name}">
                        ${plusSVG}
                        <p class='modify-links-button-text'></p>
                    </button>
                    <button class="modify-links-button edit-links-button" data-tab="${category.name}">
                        ${editSVG}
                    </button>
                </div>
            </div>
        `;
        tabContents.innerHTML += tabContentHTML;
        
        displayCategoryLinks(category.name);
    });

    setupTabListeners();
    setupAddListeners();
    setupEditListeners();
    setupRemoveTabListeners();
    setupDragAndDropListeners();
}

function toggleEditMode(buttonId) {
    const removeButtons = document.querySelectorAll('.link-remove-button');
    const editButton = document.querySelector(`.modify-links-button.edit-links-button[data-tab="${buttonId}"]`);
    activeEditButton = buttonId;
    if (editMode) {
        removeButtons.forEach(button => {
            button.style.display = 'none';
            editButton.classList.remove('button-active');
        });
        editMode = false;
    } else {
        removeButtons.forEach(button => {
            button.style.display = 'block';
            editButton.classList.add('button-active');
        });
        editMode = true;
    }
    
}

function removeCategory(categoryName) {
    // Retrieve the linksArray from localStorage
    const mainArray = JSON.parse(localStorage.getItem('linksArray')) || [];

    // Find the index of the category to be removed
    const categoryIndex = mainArray.findIndex(cat => cat.name === categoryName);

    // If the category exists, remove it from the array
    if (categoryIndex !== -1) {
        mainArray.splice(categoryIndex, 1);
    }

    // Save the updated array back to localStorage
    localStorage.setItem('linksArray', JSON.stringify(mainArray));

    // Call loadTabs to update the UI
    loadTabs();
}

async function displayCategoryLinks(categoryName) {
    const main_array = JSON.parse(localStorage.getItem('linksArray')) || [];
    const category = main_array.find(cat => cat.name === categoryName);

    const linksContainer = document.getElementById(`linksContainer-${categoryName}`);
    linksContainer.innerHTML = '';

    const defaultSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>`;
    const defaultSvgDataUri = `data:image/svg+xml;base64,${btoa(defaultSvg)}`;

    category.links.forEach(async (link, index) => {
        const linkHTML = `
            <div class="link-row" id="link-${index}-${categoryName}">
                <a class="link-a" href="${link.url}" target="_blank">
                    <img src="${defaultSvgDataUri}" alt="Favicon" class="favicon" id="favicon-${index}-${categoryName}">
                    ${link.name}
                </a>
                <button class="link-remove-button" data-index="${index}" data-category="${categoryName}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            </div>
        `;
        linksContainer.innerHTML += linkHTML;
        
        if (link.icon == "") {
            iconSrc = `https://www.google.com/s2/favicons?sz=64&domain_url=${link.url}`;
        } else {
            iconSrc = `https://www.google.com/s2/favicons?sz=64&domain_url=${link.icon}`;
        }
        
        document.getElementById(`favicon-${index}-${categoryName}`).src = iconSrc;
    });

    setupRemoveListeners();
}

function loadForm(categoryName, button) {
    let formContainer = document.getElementById('form-container');

    if (formContainer) {
        formContainer.remove();
        button.children[1].innerHTML = '';
    } else {
        button.children[1].innerHTML = 'Cancel';
        const formHTML = `
            <div id="form-container">
                <input type="text" id="linkName" placeholder="Link Name">
                <input type="text" id="linkURL" placeholder="Link URL">
                <input type="text" id="iconURL" placeholder="Icon URL (optional)">
                <button id="linkSubmit">Add Link</button>
            </div>
        `;
        const linksContainer = document.getElementById(`linksContainer-${categoryName}`);
        linksContainer.innerHTML += formHTML;

        const linkSubmitButton = document.getElementById('linkSubmit');
        linkSubmitButton.addEventListener('click', addLink);
    }
}

function addLink() {
    const linkNameInput = document.getElementById('linkName');
    const linkURLInput = document.getElementById('linkURL');
    const iconURLInput = document.getElementById('iconURL');
    const linkName = linkNameInput.value.trim();
    const linkURL = linkURLInput.value.trim();
    const iconURL = iconURLInput.value.trim();

    if (linkName && linkURL) {
        const mainArray = JSON.parse(localStorage.getItem('linksArray')) || [];
        const activeTab = document.querySelector('.tab-button.active').getAttribute('data');
        const category = mainArray.find(cat => cat.name === activeTab);

        category.links.push({ name: linkName, url: linkURL, icon: iconURL });
        localStorage.setItem('linksArray', JSON.stringify(mainArray));
        displayCategoryLinks(category.name);
        activeAddButton.children[1].innerHTML = '';
    }
}

function showNewTabForm() {
    const formHTML = `
        <div id="new-tab-form-container">
            <input type="text" id="tabName" placeholder="Tab Name">
            <button id="tabSubmit">Add Tab</button>
        </div>
    `;
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML += formHTML;

    
}

function addNewTab() {
    const tabNameInput = document.getElementById('tabName');
    const tabName = tabNameInput.value.trim();

    if (tabName) {
        const mainArray = JSON.parse(localStorage.getItem('linksArray')) || [];
        mainArray.push({ name: tabName, links: [] });
        localStorage.setItem('linksArray', JSON.stringify(mainArray));
        displayCategoryLinks(tabName);
    }
    loadTabs();
}

function setupRemoveListeners() {
    const removeButtons = document.querySelectorAll('.link-remove-button');

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const category = this.getAttribute('data-category');

            const mainArray = JSON.parse(localStorage.getItem('linksArray')) || [];
            const categoryObj = mainArray.find(cat => cat.name === category);
            categoryObj.links.splice(index, 1);

            localStorage.setItem('linksArray', JSON.stringify(mainArray));
            toggleEditMode(activeEditButton)
            displayCategoryLinks(category);
        });
    });
}

function setupEditListeners() {
    const editButtons = document.querySelectorAll('.edit-links-button');

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonId = button.getAttribute('data-tab');
            toggleEditMode(buttonId);
        });
    });
}

function setupAddListeners() {
    // Attach event listener to new link button
    const addButtons = document.querySelectorAll('.add-links-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonId = button.getAttribute('data-tab');
            activeAddButton = button;
            loadForm(buttonId, button);

        });
    });
}

function setupRemoveTabListeners() {
    // Attach event listener to new link button
    const addButtons = document.querySelectorAll('.tab-remove-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonId = button.getAttribute('data-category');
            removeCategory(buttonId);
        });
    });
}

document.addEventListener('DOMContentLoaded', loadTabs);

document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("newTabModal");
    var btn = document.getElementById("newTab");
    var span = document.getElementsByClassName("close")[0];

    const tabSubmitButton = document.getElementById('tabSubmit');
    tabSubmitButton.addEventListener('click', addNewTab);

    function closeModal() {
        modal.style.display = "none";
        tabNameInput.value = ""; // Clear the input field
    }

    tabSubmitButton.addEventListener('click', closeModal);

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        closeModal();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("manageTabsModal");
    var btn = document.getElementById("manageTabs");
    var span = document.getElementsByClassName("close")[1];

    function closeModal() {
        modal.style.display = "none";
    }

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        closeModal();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
});