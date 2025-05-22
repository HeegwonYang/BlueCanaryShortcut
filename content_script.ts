import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({
    service: 'https://bsky.social'
})

async function agentLogin(handle, pass){
    try {
        let result = await agent.login({
            identifier: handle,
            password: pass
        })

        const { data } = await agent.getProfile({})
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
browser.runtime.onMessage.addListener((message) => {
    if (message.command === "login"){
        agentLogin(message.identifier, message.password);
    }
    else if (message.command === "logout"){

    }
});
