window.addEventListener("DOMContentLoaded", function () {
    var login = document.getElementById('login');
    var logout = document.getElementById("logout");
    // upon loading the popup, send a message to the background script to resume a previously-existing session
    browser.runtime.sendMessage({
        source: "popup",
        command: "resume",
        identifier: "",
        password: "",
        error: ""
    });
    if (login) {
        login.addEventListener("click", function () {
            browser.runtime.sendMessage({
                source: "popup",
                command: "login",
                identifier: document.getElementById("user").value,
                password: document.getElementById("pass").value,
                error: ""
            });
        });
    }
    if (logout) {
        logout.addEventListener("click", function () {
            browser.runtime.sendMessage({
                source: "popup",
                command: "logout",
                identifier: "",
                password: "",
                error: ""
            });
        });
    }
    //listen for one-off messages
    browser.runtime.onMessage.addListener(changeLayout);
    function changeLayout(message) {
        // if the message came from the popup script itself, don't listen
        if (message.source === "popup") {
            return;
        }
        if (message.command === "login") {
            document.querySelector("#login-content").classList.add("hidden");
            document.querySelector("#error-content").classList.add("hidden");
            document.querySelector("#active-content").classList.remove("hidden");
            let handle = document.getElementById("handle");
            if (handle)
                handle.innerHTML = message.identifier;
        }
        else if (message.command === "logout") {
            document.querySelector("#login-content").classList.remove("hidden");
            document.querySelector("#error-content").classList.add("hidden");
            document.querySelector("#active-content").classList.add("hidden");
        }
        else if (message.command === "error") {
            document.querySelector("#error-content").classList.remove("hidden");
        }
    }
});
export {};
