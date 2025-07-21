import { AtpAgent } from '@atproto/api'

type Message = {
        readonly command: string;
        identifier: string;
        password: string;
        error: string;
}
    

const agent = new AtpAgent({
    service: 'https://bsky.social'
})

//listen for one-off messages
browser.runtime.onMessage.addListener(logFunc);

function logFunc(message: Message) {
    // get identifier and password from the message from the popup
    const identifier = message.identifier;
    const pass = message.password;

    if (message.command === "login"){
        async () => {
            try {
            // attempt to log in via atproto api
            const login = await agent.login({
                    identifier: identifier,
                    password: pass
                })
            //if successful, send a message to the popup to change around the hidden content to show the active part
            console.log(login);

            browser.runtime.sendMessage({
                command: "login",
                identifier: "",
                password: "",
                error: ""
            })
            
            } 
            // if the login fails, send a message to the popup script to display the error screen and go back to the login screen.
            catch (error){
                browser.runtime.sendMessage({
                    command: "error",
                    identifier: "",
                    password: "",
                    error: error
                })
            }
        }
    }

    // if the user has clicked the logout button
    else if (message.command === "logout"){
        async () => {
            try {
                const logout = await agent.logout();

                console.log(logout);
                // if logout is successful, send a message
                browser.runtime.sendMessage({
                    command: "logout"
                    
                })
            }

            catch (error){
                browser.runtime.sendMessage({
                    command: "error",
                    identifier: "",
                    password: "",
                    error: ""
                })
            }
        }
    }
    
}
