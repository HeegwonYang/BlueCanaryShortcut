// compose the DOM node for the bookmark button
let bookmarkButton = document.createDocumentFragment();
let buttonDiv = document.createElement("div");
buttonDiv.className = "css-g5y9jx";
buttonDiv.style = "flex: 1 1 0%; align-items: flex-start;";
let button = document.createElement("button");
button.ariaLabel = "Bookmark";
button.ariaPressed = "false";
button.role = "button";
button.tabIndex = 0;
button.className = "css-g5y9jx r-1loqt21 r-1otgn73";
button.style = "justify-content: center; background-color: rgba(0, 0, 0, 0); border-radius: 999px; flex-direction: row; align-items: center; gap: 4px; padding: 5px;";
button.type = "button";
button.setAttribute("data-testId", "bookmark");
let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttributeNS(null, "class", "css-g5y9jx");
svg.setAttributeNS(null, "fill", "none");
svg.setAttributeNS(null, "width", "18");
svg.setAttributeNS(null, "viewBox", "0 0 24 24");
svg.setAttributeNS(null, "height", "18");
svg.setAttributeNS(null, "style", "color: rgb(120, 142, 165); pointer-events: none;");
let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttributeNS(null, "fill", "hsl(211, 20%, 56%)");
path.setAttributeNS(null, "fill-rule", "evenodd");
path.setAttributeNS(null, "clip-rule", "evenodd");
path.setAttributeNS(null, "d", "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z");
bookmarkButton.appendChild(buttonDiv).appendChild(button).appendChild(svg).appendChild(path);
// add an observer that will check for any new posts in the feed and add a bookmark button in there if it isn't added yet
const observer = new MutationObserver(() => {
    [...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center; padding-top: 2px;']")]
        .forEach(el => {
        if (el.childElementCount < 6) {
            // clone the base bookmark button node and then add all the necessary event listeners to it
            const clone = bookmarkButton.cloneNode(true);
            addListeners(clone);
            el.appendChild(clone);
        }
    });
    // for individual post pages
    [...document.querySelectorAll("div[style*='padding-top: 8px; padding-bottom: 2px; margin-left: -5px;']")]
        .forEach(el => {
        if (el.firstElementChild.childElementCount < 6) {
            const altBookmark = bookmarkButton.cloneNode(true);
            altBookmark.firstElementChild.setAttribute("style", "align-items: center;");
            const svg = altBookmark.querySelector("svg");
            svg.setAttributeNS(null, "width", "22");
            svg.setAttributeNS(null, "height", "22");
            addListeners(altBookmark);
            el.firstElementChild.appendChild(altBookmark);
        }
    });
});
function addListeners(node) {
    node.firstElementChild.firstElementChild.addEventListener("pointerenter", (event) => {
        event.target.style.backgroundColor = "rgb(30, 41, 54)";
    });
    node.firstElementChild.firstElementChild.addEventListener("pointerleave", (event) => {
        event.target.style.backgroundColor = "rgba(0, 0, 0, 0)";
    });
    node.firstElementChild.firstElementChild.addEventListener("click", () => {
    });
}
observer.observe(document, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
});
export {};
