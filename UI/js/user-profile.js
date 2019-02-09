let currentUrl = window.location.href
console.log(localStorage.isAdmin)
console.log(localStorage.currentUser)
if (localStorage.isAdmin === "true") {
  if (currentUrl.split("?")[1].split("=")[0] !== "admin&&super&&user") {
    console.log(currentUrl.split("?")[1].split("=")[0])
    document.querySelector("body").innerHTML = "page not found"
  }
} else if (localStorage.isAdmin === "false") {
  if (currentUrl.split("?")[1].split("=")[0] !== "user&&user") {
    console.log(currentUrl.split("?")[1].split("=")[0])
    document.querySelector("body").innerHTML = "page not found"
  }
} else {
  window.setTimeout(function () {
    location.href = "https://kburudi.github.io/Questioner-UI/UI/signin.html";
  }, 0);
}

let userId = currentUrl.split("user=")[1].split("?")[0]
userId = parseInt(userId)

let getUserInfo = () => {
  fetch(`https://questioner--api.herokuapp.com/api/v2/auth/user/info`, {
      headers: {
        "x-access-token": localStorage.token
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        let commentCount = data.comments
        document.querySelector(".com-count").textContent = commentCount
        let questionCount = data.questions
        document.querySelector(".q-count").textContent = questionCount
        let rsvpCount = data.rsvps
        let userImage = data.image
        document.querySelector(".username").textContent = data.username
        document.querySelector(".prof-image").setAttribute("src", userImage)
        let questions = data.topQuestions
        let feedBox = document.querySelector(".top-feeds")
        if (rsvpCount == 0) {
          let questionFeeds = document.createElement("div")
          questionFeeds.classList.add("meetup-feeds")
          questionFeeds.textContent = "You have Not rsvp'd YES to any meetup"
          feedBox.appendChild(questionFeeds)
        } else {
          questions.forEach(question => {
            let feedMeetup = document.createElement("a")
            feedMeetup.classList.add("feeds-to-questions")
            let questionFeeds = document.createElement("div")
            questionFeeds.classList.add("meetup-feeds")
            let feedContainer = document.createElement("div")
            feedContainer.classList.add("question-asked")
            let feedTitle = document.createElement("p")
            feedTitle.classList.add("question-title")
            feedTitle.textContent = question.title
            let feedBody = document.createElement("p")
            feedBody.classList.add("question-body")
            feedBody.textContent = question.body
            feedContainer.appendChild(feedTitle)
            feedContainer.appendChild(feedBody)
            questionFeeds.appendChild(feedContainer)
            feedMeetup.appendChild(questionFeeds)
            feedBox.appendChild(feedMeetup)
            let meetupUrl = `https://kburudi.github.io/Questioner-UI/UI/meetups.html?id=${question.meetup}`
            feedMeetup.setAttribute("href", meetupUrl)
            feedMeetup.addEventListener("mouseover", e => {
              questionFeeds.style.backgroundColor = "#f3f3f3"
            })
            feedMeetup.addEventListener("mouseout", e => {
              questionFeeds.style.backgroundColor = "#fff"
            })
          })
        }
        if (feedBox.childNodes.length === 3) {
          let questionFeeds = document.createElement("div")
          questionFeeds.classList.add("meetup-feeds")
          questionFeeds.textContent = "You have Not rsvp'd YES to any upcoming meetup or questions are yet to be posted to the meetup"
          feedBox.appendChild(questionFeeds)
        }
      }
    })
}

getUserInfo()

let toControls = document.querySelector(".control-room")
console.log(toControls)
if (toControls !== null) {
  toControls.addEventListener("click", e => {
    e.preventDefault()
    window.setTimeout(() => {
      location.href = `https://kburudi.github.io/Questioner-UI/UI/controls.html?control_panel`
    })
  })
}