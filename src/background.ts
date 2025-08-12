import { AtpAgent, AtpSessionData, AtpSessionEvent } from '@atproto/api'

type Message = {
        readonly source: string,
        command: string;
        identifier: string;
        password: string;
        error: string;
}

    

const agent = new AtpAgent({
    service: 'https://bsky.social',
    persistSession: async (__?: AtpSessionEvent, sess?: AtpSessionData) => {
        //store session data for reuse
        if (sess !== undefined){
            browser.storage.local.set({'savedSession': JSON.stringify(sess) as string});
            let session = await browser.storage.local.get(["savedSession"]);
            console.log(session);
        }
    }
})

//listen for one-off messages
browser.runtime.onMessage.addListener(logFunc);

async function logFunc(message: Message) {
    console.log("got a message");
    // get identifier and password from the message from the popup
    const identifier = message.identifier;
    const pass = message.password;

    if (message.source === "background"){
        return;
    }

    if (message.command === "resume"){
        const sessionData = await browser.storage.local.get(["savedSession"]);
        console.log("retrieved session data: %s", sessionData.savedSession);
        // if the popup opens and there's saved session data
        if (sessionData !== undefined){
            try {
                // resume session with the saved session data
                let parsedSession = JSON.parse(sessionData.savedSession);

                await agent.resumeSession(parsedSession);

                // send message to 
                browser.runtime.sendMessage({
                            source: "background",
                            command: "login",
                            identifier: parsedSession.handle,
                            password: "",
                            error: ""
                })
            }
            catch (e) {
                console.log(e);
                console.log("Invalid session data or no session found, log in manually");
            }
        }   

        else{
            console.log("no session found");
        }
    }

    if (message.command === "login"){
            try {
                // attempt to log in via atproto api
                let login = await agent.login({
                        identifier: identifier,
                        password: pass
                    }) 

                console.log(login);
                let sessionData = JSON.stringify(await agent.session);
                await browser.storage.local.set({'savedSession': sessionData});
                
                browser.runtime.sendMessage({
                    source: "background",
                    command: "login",
                    identifier: identifier,
                    password: "",
                    error: ""
                })
            
            } 
            // if the login fails, send a message to the popup script to display the error screen and go back to the login screen.
            catch (error){
                console.log("catch activated");
                browser.runtime.sendMessage({
                    source: "background",
                    command: "error",
                    identifier: "",
                    password: "",
                    error: "failed to login: incorrect handle/password"
                })
            }
        }

    // if the user has clicked the logout button
    else if (message.command === "logout"){
            try {
                const logout = await agent.logout();

                console.log(logout);

                browser.storage.local.remove(["savedSession"]).then(
                    () => {console.log("session removal ok");},
                    (error) => {console.log(error);}
                );


                // if logout is successful, send a message
                browser.runtime.sendMessage({
                    command: "logout"
                    
                })
            }

            catch (error){
                browser.runtime.sendMessage({
                    source: "background",
                    command: "error",
                    identifier: "",
                    password: "",
                    error: ""
                })
            }
        }
}
    
