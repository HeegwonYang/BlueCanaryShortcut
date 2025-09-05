type Message = {
        readonly source: string,
        command: string;
        identifier?: string;
        password?: string;
        error?: string;
}

// variable to keep track of the last bookmark icon clicked on
let lastClicked: DocumentFragment;

// compose the DOM node for the bookmark button
let bookmarkButton = document.createDocumentFragment();

let buttonDiv = document.createElement("div");
buttonDiv.className = "css-g5y9jx";
buttonDiv.style = "flex: 1 1 0%; align-items: flex-start;";

let secondDiv = document.createElement("div");
secondDiv.className = "css-g5y9jx";

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
svg.setAttributeNS(null, "height", "18")
svg.setAttributeNS(null, "style", "color: rgb(120, 142, 165); pointer-events: none;");

let path = document.createElementNS("http://www.w3.org/2000/svg", "path")

path.setAttributeNS(null, "fill", "hsl(211, 20%, 56%)");
path.setAttributeNS(null, "fill-rule", "evenodd");
path.setAttributeNS(null, "clip-rule", "evenodd");
path.setAttributeNS(null, "d", "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z");

bookmarkButton.appendChild(buttonDiv).appendChild(button).appendChild(secondDiv).appendChild(svg).appendChild(path);

let csPort = browser.runtime.connect({ name: "cs-port" });

csPort.postMessage({ 
    source: "cs",
    error: "hello from content script" 
});

csPort.onMessage.addListener((m) => {
    // if the post has been successfully added to bookmarks:
    if ((m as Message).command = "fill"){
        //change lastClicked
        console.log(lastClicked);
    }

    // if the post has been successfully removed from bookmarks:

    
})


// add an observer that will check for any new posts in the feed and add a bookmark button in there if it isn't added yet
const observer = new MutationObserver(() => {
        [...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center; padding-top: 2px;']")!]
        .forEach(el => {
                if (el.childElementCount < 6){
                    // clone the base bookmark button node and then add all the necessary event listeners to it
                    const clone = bookmarkButton.cloneNode(true);
                    addListeners(clone as DocumentFragment);

                    // check this post--- if this is already in the bookmarks feed, hide the "unfilled" bookmark and show the "filled" icon
                    el.appendChild(clone);
                }
            }
        );

        // for individual post pages
        [...document.querySelectorAll("div[style*='padding-top: 8px; padding-bottom: 2px; margin-left: -5px;']")!]
            .forEach(el => {
                if (el.firstElementChild!.childElementCount < 6){
                    const altBookmark = bookmarkButton.cloneNode(true) as DocumentFragment;
                    altBookmark.firstElementChild!.setAttribute("style", "align-items: center;")
                    const svg = altBookmark.querySelector("svg")
                    svg!.setAttributeNS(null, "width", "22");
                    svg!.setAttributeNS(null, "height", "22");
                    addListeners(altBookmark);
                    el.firstElementChild!.appendChild(altBookmark);
                }
            }
        );
});

function addListeners(node: DocumentFragment) {
    let filledSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    filledSvg.setAttributeNS(null, "class", "r-84gixx");
    filledSvg.setAttributeNS(null, "fill", "none");
    filledSvg.setAttributeNS(null, "width", node.querySelector("svg")!.getAttributeNS(null, "width")!);
    filledSvg.setAttributeNS(null, "viewBox", "0 0 24 24");
    filledSvg.setAttributeNS(null, "height", node.querySelector("svg")!.getAttributeNS(null, "width")!)

    let filledPath = document.createElementNS("http://www.w3.org/2000/svg", "path")

    filledPath.setAttributeNS(null, "fill", "#208bfe");
    filledPath.setAttributeNS(null, "fill-rule", "evenodd");
    filledPath.setAttributeNS(null, "clip-rule", "evenodd");
    filledPath.setAttributeNS(null, "d", "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z");
    
    let button = node.firstElementChild!.firstElementChild!.firstElementChild!;

    // if the pointer hovers over the bookmark icon, change the background surrounding the icon
    button.addEventListener("pointerenter", (event) => {
        (event.target as HTMLElement)!.style.backgroundColor = "rgb(30, 41, 54)"
    });

    //if it leaves the hovering range, change it back
    button.addEventListener("pointerleave", (event) => {
        (event.target as HTMLElement)!.style.backgroundColor = "rgba(0, 0, 0, 0)"
    });

    node.firstElementChild!.firstElementChild!.addEventListener("click", () => {
    });

    //if clicked on, replace the svg inside the button with the
    button.addEventListener("click", (event) => {
        // set bookmark icon as the last clicked
        lastClicked = node;

        let urlSplit: string[];
        //send message to background script
        if ((event.target as HTMLElement)!.firstElementChild!.getAttributeNS(null, "width") === "18"){
            let url = (event.target as HTMLElement)!.parentElement!.parentElement!.parentElement!.parentElement!.firstElementChild!.firstElementChild!.lastElementChild!.getAttribute("href")
            console.log(url);
            //urlSplit[2] will be the handle, //urlSplit[4] will be the rkey
            urlSplit = url!.split("/");

        }

        else {
            let url = (event.target as HTMLElement)!.parentElement!.parentElement!.parentElement!.parentElement!.previousElementSibling!.firstElementChild!.getAttribute("href");
            //
            if (url === null){
                url = window.location.href
            }
            urlSplit = url!.split("/");
        }


        csPort.postMessage({
            source: "cs",
            command: "bookmark",
            identifier: urlSplit[2],
            password: urlSplit[4]
        })

        //

        // keep this element from activating other elements underneath this element
        event.stopPropagation();

        
    });

}

observer.observe(document, {
    childList: true, 
    attributes: true,
    characterData: true, 
    subtree: true 
});