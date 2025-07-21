
document.addEventListener('DOMContentLoaded', function() {
    function listenForClicks() {
        document.addEventListener("click", async (e) => {

            // send a message to the content script to have the created agent login with the given handle and password.
            function login() {
                const identifier = (document.getElementById("user") as HTMLInputElement).value;
                const password = (document.getElementById("pass") as HTMLInputElement).value;

                browser.runtime.sendMessage({
                    command: "login",
                    identifier: identifier,
                    password: password,
                });

                document.querySelector("#login-content")!.classList.add("hidden");
                document.querySelector("#error-content")!.classList.add("hidden");
                document.querySelector("#active-content")!.classList.remove("hidden");

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

            if ((e.target as HTMLElement)!.tagName !== "button" || (!(e.target as HTMLElement)!.closest("#login-content") && !(e.target as HTMLElement)!.closest("#active-content"))){
                return;
            }

            if ((e.target as HTMLElement).id == "login"){
                console.log("YAHOOOOOOOOOOOOO");
                browser.tabs.query({active: true, currentWindow: true})
                        .then(login)
                        .catch(logError);
            }
            else if ((e.target as HTMLElement).id == "logout"){
                browser.tabs.query({active: true, currentWindow: true})
                        .then(logout)
                        .catch(logError);
            }

            });
    }

    /**
     * Displays the currently logged-in user's name on the popup.
     */

    function switchToActive(){
        document
    }

    /**
     * There was an error executing the script.
     * Display the popup's error message, and hide the normal UI.
     */
    function scriptError(error) {

        document.querySelector("#error-content")!.classList.remove("hidden");
        console.error(`Failed to execute the content script: ${error.message}`);
    }

    /**
     * When the popup loads, inject a content script into the active tab,
     * and add a click handler.
     * If we couldn't inject the script, handle the error.
     */

    browser.action.onClicked.addListener(async (tab) => {
    browser.scripting.executeScript({
            target: {tabId: tab.id as number, allFrames: true},
            files: ['content_script.js'],
        }).then(listenForClicks)
        .catch(scriptError);
    });



    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "error"){
            reportError(message.error);
            scriptError(message.error);
        }
    });


});
