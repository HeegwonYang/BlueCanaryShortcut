window.addEventListener("DOMContentLoaded", function () {
    var login = document.getElementById('login');
    var logout = document.getElementById("logout");
    if (login) {
        login.addEventListener("click", () => {
            browser.runtime.sendMessage({
                command: "login",
                identifier: document.getElementById("user").value,
                password: document.getElementById("pass").value,
                error: ""
            });
        });
    }
    if (logout) {
        logout.addEventListener("click", () => {
            browser.runtime.sendMessage({
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
        if (message.command === "login") {
            document.querySelector("#login-content").classList.add("hidden");
            document.querySelector("#error-content").classList.add("hidden");
            document.querySelector("#active-content").classList.remove("hidden");
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
