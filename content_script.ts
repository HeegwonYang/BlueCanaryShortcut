console.log("content script is loaded successfully.");

type Message = {
    readonly command: string;
    identifier: string;
    password: string;
    error: string;
}

import { AtpAgent } from '@atproto/api'

let port = browser.runtime.connect({name: "portFromCS"});
port.postMessage("hello from content script");

port.onMessage.addListener((m: Array<any>) => {
  console.log("In content script, received message from background script");
  console.log(m);
});

const agent = new AtpAgent({
    service: 'https://bsky.social'
})

async function agentLogin(handle, pass){
    try {
        let result = await agent.login({
            identifier: handle,
            password: pass
        })

        browser.runtime.sendMessage({
            command: "activate"
        })
    } 
    // if the login fails, send a message to the popup script to display the error screen and go back to the login screen.
    catch (error){
        browser.runtime.sendMessage({
            command: "error",
            error: error
        })
    }
}

/*
    Listen for messages from background script, and call agentLogin as necessary
 */
port.onMessage.addListener((message: Message) => {
    if (message.command === "login"){
        agentLogin(message.identifier, message.password);
    }
    else if (message.command === "logout"){

    }
});
