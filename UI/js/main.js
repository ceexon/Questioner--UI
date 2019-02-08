let createMeetupBtn = document.querySelector(".create-meetup-btn")
if (createMeetupBtn !== null) {
  createMeetupBtn.addEventListener("click", e => {
    e.preventDefault()
    window.setTimeout(() => {
      location.href = "https://kburudi.github.io/Questioner-UI/UI/create-meetup.html?admins%20%only"
    })
  })
}

let profileLink = document.querySelector(".user-prof-link")

let userSignout = () => {
  let signoutBtn = document.querySelector(".sign-out-btn")
  if (signoutBtn !== null) {
    signoutBtn.addEventListener("click", e => {
      e.preventDefault()
      fetch("https://questioner--api.herokuapp.com/api/v2/auth/logout", {
          headers: {
            "x-access-token": localStorage.token
          }
        })
        .then(res => res.json())
        .then(data => {
          (data)
          if (data.status === 200) {
            localStorage.token = undefined;
          }
          window.setTimeout(function () {
            location.href = "https://kburudi.github.io/Questioner-UI/UI/index.html";
          }, 500);
        })
    })
  }
}

userSignout()
let homeButton = document.querySelector(".home-button")
if (localStorage.token !== "undefined") {
  (typeof (localStorage.token))
  if (homeButton !== null) {
    homeButton.style.visibility = "hidden"
  }
} else {
  if (homeButton !== null) {
    homeButton.style.visibility = "visible"
  }
}

if (profileLink !== null) {
  if (localStorage.token == "undefined" || localStorage.token == undefined) {
    localStorage.isAdmin = undefined;
    localStorage.currentUser = undefined;
    profileLink.addEventListener("click", e => {
      e.preventDefault()
      window.setTimeout(function () {
        location.href = "https://kburudi.github.io/Questioner-UI/UI/signin.html";
      }, 500);
    })
  } else {
    profileLink.addEventListener("click", e => {
      e.preventDefault()
      if (localStorage.isAdmin === "true") {
        window.setTimeout(() => {
          location.href = `https://kburudi.github.io/Questioner-UI/UI/admin-profile.html?admin&&super&&user=${localStorage.currentUser}?`
        })
      } else {
        window.setTimeout(() => {
          location.href = `https://kburudi.github.io/Questioner-UI/UI/user-profile.html?user&&user=${localStorage.currentUser}?`
        })
      }
    })
  }
}