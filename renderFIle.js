// remind: se uso IPC mi sale il suicidio

function sendURL() {
    let url = document.getElementById("URL").value;
    window.electronAPI.sendForm(url);
}

document.getElementById("darkmode-toggle").addEventListener('click', async () => {
    let checkbox = document.getElementById("switch-checkbox");
    if (!checkbox.checked) checkbox.checked = true;
    else checkbox.checked = false;

    const isDarkMode = await window.darkMode.toggle();
})

let darkCheck = document.getElementById("switch-checkbox");
let darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
if (darkQuery.matches) {
    darkCheck.checked = true;
} else {
    darkCheck.checked = false;
}