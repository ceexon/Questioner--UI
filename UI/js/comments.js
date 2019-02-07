let pageNotFound = () => {
  let mainBody = document.querySelector("body")
  mainBody.innerHTML = "";
  let errorFour04 = document.createElement("div");
  errorFour04.setAttribute(
    "style",
    "width: 100vw; height: 100vh; z-index: 6; background-color: #fff; font-size: 5em; color: #0d59a0; padding: 10% 0; position: fixed; top:0; bottom:0; left: 0; right: 0; text-align:center"
  );
  errorFour04.textContent = "Page Not Found..\n 404";
  mainBody.appendChild(errorFour04);
}
const commentSection = document.querySelector(".comment-box")
let currentUrl = window.location.href;
if (currentUrl.substr(-13) == "comments.html") {
  pageNotFound()
}
let meetupId = parseInt(currentUrl.split("meetup=")[1].split("/")[0])
let questionId = parseInt(currentUrl.split("question=")[1].split("/")[0])

let message = document.createElement("p");
message.setAttribute(
  "style",
  "width:200px; padding:20px; background-color:#f6f6f6; text-align: center; border: 1px solid #f3f3f3; position:absolute; display:none; z-index: 3;top:0"
);

let fadeIn = el => {
  el.style.display = "block";
  window.setTimeout(function () {
    el.style.display = "none";
  }, 800);
};

let singleMeetupQuestion = () => {
  fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}/questions`, {
      method: "get",
      header: {
        "x-access-token": localStorage.token,
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        let meetupData = data.meetup;
        document.querySelector(".meetup-name").textContent = meetupData.topic
        document.querySelector(".meetup-image").setAttribute("src", meetupData.image[0])
        document.querySelector(".meetup-text").textContent = meetupData.description
        document.querySelector(".venue-desc").textContent = meetupData.location
        let happenTime = new Date(meetupData.happen_on)
        let firstDateSection = happenTime.toDateString()
        let timeHours = happenTime.getHours().toString()
        let timeMinutes = happenTime.getMinutes().toString()
        let secondDateSection = timeHours + timeMinutes + "HRS"
        let displayTime = firstDateSection + " " + secondDateSection
        document.querySelector(".time-desc").textContent = displayTime

        let allQuestions = data.questions
        let availableQuestions = {}
        allQuestions.forEach(question => {
          let qId = question.id
          availableQuestions[qId] = qId
          if (question.id === questionId) {
            document.querySelector(".user-q-image").setAttribute("src", question.asker.image)
            document.querySelector(".user-name").textContent = question.asker.username
            document.querySelector(".question-title").textContent = question.title
            document.querySelector(".question-body").textContent = question.body
            document.querySelector(".comment-count").textContent = question.comments
            document.querySelector(".up-votes-count").textContent = question.votes.upvotes
            document.querySelector(".down-votes-count").textContent = question.votes.downvotes
            singleQuestionComments()
          }
        });
        if (questionId in availableQuestions) {} else {
          pageNotFound()
        }
      }

      if (
        data.status === 404 ||
        data.status === 400
      ) {
        pageNotFound()
      }
    })
}

singleMeetupQuestion()

function singleQuestionComments() {
  fetch(`https://questioner--api.herokuapp.com/api/v2/questions/${questionId}/comments`, {
      method: "get",
      header: {
        "x-access-token": localStorage.token,
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        let allComments = data.comments
        allComments.forEach(comment => {
          if (questionId === comment.Question) {
            let singleComment = document.createElement("div")
            singleComment.classList.add("user-question", "user-comment")
            let addNewComment = document.querySelector(".add-new-question.user-comment")
            commentSection.removeChild(addNewComment)
            commentSection.appendChild(singleComment)
            commentSection.appendChild(addNewComment)
            let commentImage = document.createElement("img")
            commentImage.classList.add("user-q-image")
            commentImage.setAttribute("src", comment.user.image)
            let imageContainer = document.createElement("div")
            imageContainer.classList.add("user-image-name")
            imageContainer.appendChild(commentImage)
            singleComment.appendChild(imageContainer)
            let commenterName = document.createElement("span")
            commenterName.classList.add("user-name")
            imageContainer.appendChild(commenterName)
            commenterName.textContent = comment.user.username
            let commentBox = document.createElement("div")
            commentBox.classList.add("the-question", "the-comment")
            let commentBody = document.createElement("p")
            commentBody.classList.add("question-body")
            commentBody.textContent = comment.comment
            commentBox.appendChild(commentBody)
            singleComment.appendChild(commentBox)
          }
        })
      }
    })
}

function postComment() {
  let submitBtn = document.querySelector("input.create-button")
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    let postText = document.querySelector(".question-body-field.comment-field")
    if (postText.value.trim().length === 0) {
      postText.style.borderColor = "red"
      postText.setAttribute("placeholder", "No comment was found")
    } else {
      postText.setAttribute("placeholder", "Enter your comment")
      postText.style.borderColor = "#606060"
      fetch(`https://questioner--api.herokuapp.com/api/v2/questions/${questionId}/comments`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.token
          },
          body: JSON.stringify({
            "comment": postText.value
          }),
          method: "post"
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 401) {
            message.textContent = "please login to continue"
            message.style.color = "red"
            document.querySelector(".add-new-question").appendChild(message)
            fadeIn(message)
            window.setTimeout(function () {
              location.href = "https://kburudi.github.io/Questioner-UI/UI/signin.html";
            }, 1000);
          }

          if (data.status === 201) {
            comment = data.data
            document.querySelector(".new-question-form.new-comment-form").reset()
            let singleComment = document.createElement("div")
            singleComment.classList.add("user-question", "user-comment")
            let addNewComment = document.querySelector(".add-new-question.user-comment")
            commentSection.removeChild(addNewComment)
            commentSection.appendChild(singleComment)
            commentSection.appendChild(addNewComment)
            let commentImage = document.createElement("img")
            commentImage.classList.add("user-q-image")
            commentImage.setAttribute("src", comment.user.image)
            let imageContainer = document.createElement("div")
            imageContainer.classList.add("user-image-name")
            imageContainer.appendChild(commentImage)
            singleComment.appendChild(imageContainer)
            let commenterName = document.createElement("span")
            commenterName.classList.add("user-name")
            imageContainer.appendChild(commenterName)
            commenterName.textContent = comment.user.username
            let commentBox = document.createElement("div")
            commentBox.classList.add("the-question", "the-comment")
            let commentBody = document.createElement("p")
            commentBody.classList.add("question-body")
            commentBody.textContent = comment.comment
            commentBox.appendChild(commentBody)
            singleComment.appendChild(commentBox)
            let commentCounts = document.querySelector(".comment-count")
            commentCounts.textContent = parseInt(commentCounts.textContent) + 1
          }
        })
    }
  })
}

postComment()

document.querySelector(".back-to-questions").addEventListener("click", e => {
  e.preventDefault()
  history.back()
})