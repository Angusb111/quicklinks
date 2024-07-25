document.addEventListener("DOMContentLoaded", function() {
    const element = document.body;
    const imageName = "wallpaper";
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];

    function setBackgroundImage(element, imageName, extensions) {
        for (let extension of extensions) {
            const imageUrl = `${imageName}.${extension}`;
            const img = new Image();
            img.onload = function() {
                element.style.backgroundImage = `url(${imageUrl})`;
            };
            img.onerror = function() {
            };
            img.src = imageUrl;
        }
    }

    setBackgroundImage(element, imageName, extensions);
});
