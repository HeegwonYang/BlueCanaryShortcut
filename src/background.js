import { AtpAgent } from '@atproto/api';
let portFromCS;
let localBookmarks;
const agent = new AtpAgent({
    service: 'https://bsky.social',
    persistSession: async (__, sess) => {
        //store session data for reuse
        if (sess !== undefined) {
            browser.storage.local.set({ 'savedSession': JSON.stringify(sess) });
            let session = await browser.storage.local.get(["savedSession"]);
            console.log(session);
        }
    }
});
browser.runtime.onConnect.addListener(connected);
function connected(p) {
    portFromCS = p;
    portFromCS.postMessage({
        source: "bg",
        error: "hello from background script"
    });
    // receive messages from the cs port
    portFromCS.onMessage.addListener(async (m) => {
        let message = m;
        if (message.command === "bookmark") {
            try {
                await resume();
                // identifier is the handle, password is rkey 
                let repo = (await agent.resolveHandle({ handle: message.identifier })).data.did;
                let post = await agent.getPost({ repo: repo, rkey: message.password });
                console.log(post);
                let results = await agent.withProxy('atproto_labeler', 'did:plc:w6yx4bltuzdmiolooi4kd6zt').createModerationReport({
                    reasonType: 'com.atproto.moderation.defs#reasonOther',
                    reason: 'Bookmark report made automatically with BlueCanary Shortcut',
                    subject: {
                        $type: 'com.atproto.repo.strongRef',
                        uri: post.uri,
                        cid: post.cid
                    }
                });
                console.log(results);
            }
            catch (error) {
                console.log(`failed to bookmark post: ${error}`);
            }
        }
    });
}
//listen for one-off messages
browser.runtime.onMessage.addListener(logFunc);
async function logFunc(message) {
    console.log("got a message");
    // get identifier and password from the message from the popup
    const identifier = message.identifier;
    const pass = message.password;
    if (message.source === "background") {
        return;
    }
    if (message.command === "resume") {
        resume();
    }
    if (message.command === "login") {
        try {
            if (identifier === undefined || pass === undefined) {
                browser.runtime.sendMessage({
                    source: "background",
                    command: "error",
                    identifier: "",
                    password: "",
                    error: "identifier and/or password are undefined"
                });
            }
            else {
                // attempt to log in via atproto api
                let login = await agent.login({
                    identifier: identifier,
                    password: pass
                });
                console.log(login);
                let sessionData = JSON.stringify(await agent.session);
                await browser.storage.local.set({ 'savedSession': sessionData });
                browser.runtime.sendMessage({
                    source: "background",
                    command: "login",
                    identifier: identifier,
                });
            }
            updateLocalBookmarks();
        }
        // if the login fails, send a message to the popup script to display the error screen and go back to the login screen.
        catch (error) {
            console.log("catch activated");
            browser.runtime.sendMessage({
                source: "background",
                command: "error",
                error: "failed to login: incorrect handle/password"
            });
        }
    }
    // if the user has clicked the logout button
    else if (message.command === "logout") {
        try {
            const logout = await agent.logout();
            console.log(logout);
            browser.storage.local.remove(["savedSession"]).then(() => { console.log("session removal ok"); }, (error) => { console.log(error); });
            localBookmarks = [];
            // if logout is successful, send a message
            browser.runtime.sendMessage({
                command: "logout"
            });
        }
        catch (error) {
            browser.runtime.sendMessage({
                source: "background",
                command: "error",
                identifier: "",
                password: "",
                error: ""
            });
        }
    }
}
async function updateLocalBookmarks() {
    // save current bookmarks as current local bookmark list to reference
    let getBookmarks = await agent.app.bsky.feed.getFeed({
        feed: "at://did:plc:w6yx4bltuzdmiolooi4kd6zt/app.bsky.feed.generator/bookmarks",
        limit: 100
    });
    localBookmarks = getBookmarks.data.feed;
    while (getBookmarks.data.cursor !== "") {
        getBookmarks = await agent.app.bsky.feed.getFeed({
            feed: "at://did:plc:w6yx4bltuzdmiolooi4kd6zt/app.bsky.feed.generator/bookmarks",
            limit: 100,
            cursor: getBookmarks.data.cursor
        });
        localBookmarks.concat(getBookmarks.data.feed);
    }
    console.log(localBookmarks);
}
async function resume() {
    const sessionData = await browser.storage.local.get(["savedSession"]);
    console.log("retrieved session data: %s", sessionData.savedSession);
    // if the popup opens and there's saved session data
    if (sessionData !== undefined) {
        try {
            // resume session with the saved session data
            let parsedSession = JSON.parse(sessionData.savedSession);
            await agent.resumeSession(parsedSession);
            // send message to popup script to send the resumed session's handle
            browser.runtime.sendMessage({
                source: "background",
                command: "login",
                identifier: parsedSession.handle,
            });
            updateLocalBookmarks();
        }
        catch (e) {
            console.log(e);
            console.log("Invalid session data or no session found, log in manually");
        }
    }
    else {
        console.log("no session found");
    }
}
