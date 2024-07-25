function setupDragAndDropListeners() {
    const tabsContainer = document.getElementById('tabs');
    const tabs = tabsContainer.querySelectorAll('.tab-button');

    tabs.forEach(tab => {
        tab.addEventListener('dragstart', handleDragStart);
        tab.addEventListener('dragover', handleDragOver);
        tab.addEventListener('drop', handleDrop);
        tab.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-index'));
    e.target.classList.add('dragging');
    createPlaceholder(e.target);
}

function handleDragOver(e) {
    e.preventDefault();
    const target = e.target;
    const draggingElement = document.querySelector('.dragging');
    const placeholder = document.querySelector('.placeholder');
    
    if (target.classList.contains('tab-button') && target !== draggingElement) {
        const tabsContainer = target.parentElement;
        const elements = Array.from(tabsContainer.children).filter(child => child.classList.contains('tab-button') && child !== draggingElement);
        const draggingIndex = elements.indexOf(draggingElement);
        const targetIndex = elements.indexOf(target);
        const isMovingDown = draggingIndex < targetIndex;

        if (isMovingDown) {
            tabsContainer.insertBefore(placeholder, target.nextSibling);
        } else {
            tabsContainer.insertBefore(placeholder, target);
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    const draggingIndex = e.dataTransfer.getData('text/plain');
    const targetIndex = e.target.getAttribute('data-index');
    
    if (draggingIndex !== targetIndex) {
        reorderTabs(draggingIndex, targetIndex);
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    removePlaceholder();
}

function reorderTabs(oldIndex, newIndex) {
    const mainArray = JSON.parse(localStorage.getItem('linksArray')) || [];
    const [movedItem] = mainArray.splice(oldIndex, 1);
    mainArray.splice(newIndex, 0, movedItem);
    localStorage.setItem('linksArray', JSON.stringify(mainArray));
    loadTabs();
}

function createPlaceholder(draggedElement) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.width = `${draggedElement.offsetWidth}px`;
    placeholder.style.height = `${draggedElement.offsetHeight}px`;
    draggedElement.parentElement.insertBefore(placeholder, draggedElement.nextSibling);
}

function removePlaceholder() {
    const placeholder = document.querySelector('.placeholder');
    if (placeholder) {
        placeholder.parentElement.removeChild(placeholder);
    }
}