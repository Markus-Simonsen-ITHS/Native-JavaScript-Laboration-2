let githubParams = {}

githubParams.headers = {
    "Authorization": `Bearer ${localStorage.getItem('code')}`
}

const userInfoPromise = fetch("https://api.github.com/user", githubParams)

document.addEventListener("DOMContentLoaded", async function () {
    let loggedInMessage = document.getElementById("loggedIn")
    let profilePic = document.getElementById("pfp")
    const response = await userInfoPromise
    const userInfo = await response.json()
    if (!userInfo.login) window.location = "/website/login"
    console.log(userInfo)
    profilePic.setAttribute("src", userInfo.avatar_url + "&s=50")
    const name = userInfo.name ? userInfo.name : userInfo.login
    loggedInMessage.innerText = "Logged in as " + name

});
