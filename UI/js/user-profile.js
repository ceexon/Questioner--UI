let currentUrl = window.location.href
console.log(currentUrl)
let userId = currentUrl.split("user=")[1].split("?")[0]
userId = parseInt(userId)
console.log(userId)

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
        console.log(rsvpCount)
        let userImage = data.image
        document.querySelector(".username").textContent = data.username
        document.querySelector(".prof-image").setAttribute("src", userImage)
        let questions = data.topQuestions
        let feedBox = document.querySelector(".top-feeds")
        console.log("rsvp count ==> ", rsvpCount)
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
          questionFeeds.textContent = "You have Not rsvp'd YES to any upcoming meetup"
          feedBox.appendChild(questionFeeds)
        }
      }
    })
}

getUserInfo()