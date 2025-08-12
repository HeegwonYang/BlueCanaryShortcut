const observer = new MutationObserver(() => {
    // Perform actions based on the mutation
    [...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center; padding-top: 2px;']")]
        .forEach(el => {
        el.style.border = "5px solid red";
    });
    [...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center;']")]
        .forEach(el => el.style.border = "5px solid red");
});
observer.observe(document, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
});
export {};
