document.addEventListener("DOMContentLoaded", function() {
    const element = document.getElementById("elementId"); // Replace with your element's ID
    const basePath = "path/to/your/images/"; // Replace with the path to your images
    const imageName = "wallpaper";
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];

    function setBackgroundImage(element, basePath, imageName, extensions) {
        for (let extension of extensions) {
            const imageUrl = `${basePath}${imageName}.${extension}`;
            const img = new Image();
            img.onload = function() {
                element.style.backgroundImage = `url(${imageUrl})`;
            };
            img.onerror = function() {
                console.log(`Failed to load image: ${imageUrl}`);
            };
            img.src = imageUrl;
        }
    }

    setBackgroundImage(element, basePath, imageName, extensions);
});
