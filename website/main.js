let params = {}

params.headers = {
    "Authorization": `Bearer ${localStorage.getItem('code')}`
}

let userInfoPromise = fetch("https://api.github.com/user", params)

document.addEventListener("DOMContentLoaded", async function () {
    let loggedInMessage = document.getElementById("loggedIn")
    let profilePic = document.getElementById("pfp")
    let response = await userInfoPromise
    let userInfo = await response.json()
    if(!userInfo.login) window.location = "/website/login"
    console.log(userInfo)
    profilePic.setAttribute("src", userInfo.avatar_url + "&s=50")
    loggedInMessage.innerText = "Logged in as " + userInfo.login
});

