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








const observer = new MutationObserver(() => {
        // Perform actions based on the mutation
        [...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center; padding-top: 2px;']")!]
        .forEach(el => {
                (el as HTMLElement).style.border = "5px solid red";
            }
        );

        [...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center;']")!]
            .forEach(el =>
             (el as HTMLElement).style.border = "5px solid red");
});

observer.observe(document, {
    childList: true, 
    attributes: true,
    characterData: true, 
    subtree: true 
});