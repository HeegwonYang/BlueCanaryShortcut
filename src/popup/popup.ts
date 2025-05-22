/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function set_event_listeners() {
  document.addEventListener("click", (e) => {

    // send a message to the content script to have the created agent login with the given handle and password.
    function login() {
        const identifier = (document.getElementById("user") as HTMLInputElement).value;
        const password = (document.getElementById("pass") as HTMLInputElement).value;

        browser.runtime.sendMessage({
            command: "login",
            identifier: identifier,
            password: password,
        });

    }

    // send a message to the content script to have the created agent logout.
    function logout(){

        browser.runtime.sendMessage({
            command: "logout"
        });

        document.querySelector("#login-content")!.classList.add("hidden");
        document.querySelector("#error-content")!.classList.add("hidden");
        document.querySelector("#active-content")!.classList.remove("hidden");
    }

    function logError(error){
        console.error(`Error occured: ${error}`);
    }

    if ((e.target as HTMLElement)!.tagName !== "BUTTON" || (!(e.target as HTMLElement)!.closest("#login-content") && !(e.target as HTMLElement)!.closest("#active-content"))){
        return;
    }

    if ((e.target as HTMLElement).id === "login"){
        browser.tabs.query({active: true, currentWindow: true})
                .then(login)
                .catch(logError);
    }
    else if ((e.target as HTMLElement).id === "logout"){
        browser.tabs.query({active: true, currentWindow: true})
                .then(logout)
                .catch(logError);
    }

    });
}

/**
 * Displays the currently logged-in user's name on the popup.
 */

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function contentScriptError(error) {

  document.querySelector("#error-content")!.classList.remove("hidden");
  console.error(`Failed to execute the content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs
  .executeScript({ file: "/content_script.ts" })
  .then(set_event_listeners)
  .catch(contentScriptError);

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "error"){
        reportError(message.error);
        contentScriptError(message.error);
    }
});

