"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("content script is loaded successfully.");
document.body.style.background = 'yellow';
const api_1 = require("@atproto/api");
let port = browser.runtime.connect({ name: "portFromCS" });
port.postMessage("hello from content script");
port.onMessage.addListener((m) => {
    console.log("In content script, received message from background script");
    console.log(m);
});
const agent = new api_1.AtpAgent({
    service: 'https://bsky.social'
});
function agentLogin(handle, pass) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield agent.login({
                identifier: handle,
                password: pass
            });
            browser.runtime.sendMessage({
                command: "activate"
            });
        }
        // if the login fails, send a message to the popup script to display the error screen and go back to the login screen.
        catch (error) {
            browser.runtime.sendMessage({
                command: "error",
                error: error
            });
        }
    });
}
/*
    Listen for messages from background script, and call agentLogin as necessary
 */
port.onMessage.addListener((message) => {
    if (message.command === "login") {
        agentLogin(message.identifier, message.password);
    }
    else if (message.command === "logout") {
    }
});
//# sourceMappingURL=content_script.js.map