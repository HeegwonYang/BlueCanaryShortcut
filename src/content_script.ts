[...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center; padding-top: 2px;']")!]
    .forEach(el =>
         (el as HTMLElement).style.border = "5px solid red");

[...document.querySelectorAll("div[style*='flex-direction: row; justify-content: space-between; align-items: center;']")!]
    .forEach(el =>
         (el as HTMLElement).style.border = "5px solid red");
