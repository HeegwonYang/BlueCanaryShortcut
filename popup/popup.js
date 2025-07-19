var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener("DOMContentLoaded", function () {
    var login = document.getElementById('login');
    var logout = document.getElementById("logout");
    let portFromCS;
    console.log(login);
    console.log(logout);
    function loginFunc() {
        const identifier = document.getElementById("user").value;
        const password = document.getElementById("pass").value;
        portFromCS.postMessage({
            command: "login",
            identifier: identifier,
            password: password,
        });
        document.querySelector("#login-content").classList.add("hidden");
        document.querySelector("#error-content").classList.add("hidden");
        document.querySelector("#active-content").classList.remove("hidden");
    }
    function logError(error) {
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
    if (login) {
        login.addEventListener("click", function () {
            return __awaiter(this, void 0, void 0, function* () {
                portFromCS.postMessage({ greeting: "they clicked the login button!" });
            });
        });
    }
    if (logout) {
        logout.addEventListener("click", function () {
            return __awaiter(this, void 0, void 0, function* () {
                portFromCS.postMessage({ greeting: "they clicked the logout button!" });
            });
        });
    }
});
//# sourceMappingURL=popup.js.map