let createMeetupBtn = document.querySelector(".create-meetup-btn")
console.log(createMeetupBtn)
if (createMeetupBtn !== null) {
  createMeetupBtn.addEventListener("click", e => {
    e.preventDefault()
    window.setTimeout(() => {
      location.href = "http://127.0.0.1:5500/create-meetup.html?admins%20%only"
    })
  })
}

let profileLink = document.querySelector(".user-prof-link")
console.log(profileLink)

if (profileLink !== null) {
  profileLink.addEventListener("click", e => {
    e.preventDefault()
    if (localStorage.isAdmin === "true") {
      window.setTimeout(() => {
        location.href = `http://127.0.0.1:5500/admin-profile.html?admin&&super&&user=${localStorage.currentUser}?`
      })
      console.log("profile")
    } else {
      window.setTimeout(() => {
        location.href = `http://127.0.0.1:5500/user-profile.html?user&&user=${localStorage.currentUser}?`
      })
      console.log("non admin")
    }
  })
}

let userSignout = () => {
  let signoutBtn = document.querySelector(".sign-out-btn")
  console.log(signoutBtn)
  if (signoutBtn !== null) {
    signoutBtn.addEventListener("click", e => {
      e.preventDefault()
      fetch("http://127.0.0.1:5000/api/v2/auth/logout", {
          headers: {
            "x-access-token": localStorage.token
          }
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.status === 200) {
            localStorage.token = undefined;
            window.setTimeout(function () {
              location.href = "http://127.0.0.1:5500/index.html";
            }, 500);
          }
        })
    })
  }
}

userSignout()
let homeButton = document.querySelector(".home-button")
if (localStorage.token !== "undefined") {
  console.log(typeof (localStorage.token))
  if (homeButton !== null) {
    homeButton.style.visibility = "hidden"
  }
} else {
  if (homeButton !== null) {
    homeButton.style.visibility = "visible"
  }
}

console.log(history)
console.log(document.referrer)