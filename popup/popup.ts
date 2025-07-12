window.addEventListener("DOMContentLoaded", function ()  {

    var login = document.getElementById('login');
    var logout = document.getElementById("logout");
    let portFromCS;

    console.log(login);
    console.log(logout);
    
    function loginFunc() {
         const identifier = (document.getElementById("user") as HTMLInputElement).value;
         const password = (document.getElementById("pass") as HTMLInputElement).value;

        portFromCS.postMessage({
            command: "login",
            identifier: identifier,
            password: password,
        });

        document.querySelector("#login-content")!.classList.add("hidden");
        document.querySelector("#error-content")!.classList.add("hidden");
        document.querySelector("#active-content")!.classList.remove("hidden");

    }

    function logError(error){
                console.error(`Error occured: ${error}`);
            }

    function connected(p) {
        portFromCS = p;
        portFromCS.postMessage({ greeting: "hi there content script!" });
        portFromCS.onMessage.addListener((m) => {
            portFromCS.postMessage({
                greeting: `In background script, received message from content script: ${m.greeting}`,
            });
         });
    }

    browser.runtime.onConnect.addListener(connected);

    if (login){
        login.addEventListener("click", async function () {
            portFromCS.postMessage({ greeting: "they clicked the login button!" });
        });
    }
    

    if (logout){
        logout.addEventListener("click", async function () {
            portFromCS.postMessage({ greeting: "they clicked the logout button!" });
        });
    }
});