let mainQuestionBox = document.querySelector(".questions-box");
let addQuestionBox = document.querySelector(".add-new-question");
requiredFields = document.querySelectorAll(".question-input");
let submitButton = document.querySelector(".create-button");
let message = document.createElement("p");
const space = "padding-left: 10px; font-size: 20px;"
message.setAttribute(
  "style",
  "width:200px; padding:20px; background-color:#f6f6f6; text-align: center; border: 1px solid #f3f3f3; position:absolute; display:none;"
);

let votingElements = (btn1, btn2) => {
  let votingBox = document.createElement("div");
  votingBox.classList.add("voting");
  // upvote
  let upVoteBox = document.createElement("div");
  upVoteBox.classList.add("up-vote");
  let voteIconUp = document.createElement("span");
  voteIconUp.setAttribute("value", btn1);
  voteIconUp.classList.add("fas", "vote-button", "fa-thumbs-up");
  let voteCountUp = document.createElement("span");
  upVoteBox.appendChild(voteIconUp);
  upVoteBox.appendChild(voteCountUp);
  voteCountUp.classList.add("vote-count");
  // downvote
  let downVoteBox = document.createElement("div");
  downVoteBox.classList.add("down-vote");
  let voteIconDown = document.createElement("span");
  voteIconDown.classList.add("fas", "vote-button", "fa-thumbs-down");
  voteIconDown.setAttribute("value", btn2);
  let voteCountDown = document.createElement("span");
  voteCountDown.classList.add("vote-count");
  downVoteBox.appendChild(voteIconDown);
  downVoteBox.appendChild(voteCountDown);
  votingBox.appendChild(upVoteBox);
  votingBox.appendChild(downVoteBox);
  let commentRep = document.createElement("div");
  commentRep.classList.add("comment-view-que");
  let commentIcon = document.createElement("span");
  commentIcon.classList.add("far", "fa-comments");
  let commentCount = document.createElement("span");
  commentCount.classList.add("comment-count");
  commentRep.appendChild(commentIcon);
  commentRep.appendChild(commentCount);
  votingBox.appendChild(commentRep);
  return votingBox;
};

voteQuestion = () => {
  voteButtons = document.querySelectorAll(".vote-button");
  voteButtons.forEach(btn => {
    btn.nextSibling.style.fontSize = "20px";
    btn.nextSibling.style.paddingLeft = "10px";
    btn.addEventListener("click", e => {
      e.preventDefault();
      name = btn.getAttribute("value");
      questionId = parseInt(name.substr(4, 2));
      voteType = name.substr(3, 1);
      theVote = "";
      if (voteType === "U") {
        theVote = "upvote";
      } else {
        theVote = "downvote";
      }
      // upvote
      fetch(
          `https://questioner--api.herokuapp.com/api/v2/questions/${questionId}/${theVote}`, {
            method: "PATCH",
            headers: {
              "x-access-token": localStorage.token
            },
            body: {
              nothing: "nothing"
            }
          }
        )
        .then(response => {
          const reader = response.body.getReader();
          const stream = new ReadableStream({
            start(controller) {
              // The following function handles each data chunk
              function push() {
                // "done" is a Boolean and value a "Uint8Array"
                reader.read().then(({
                  done,
                  value
                }) => {
                  // Is there no more data to read?
                  if (done) {
                    // Tell the browser that we have finished sending data
                    controller.close();
                    return;
                  }

                  // Get the data and send it to the browser via the controller
                  controller.enqueue(value);
                  push();
                });
              }

              push();
            }
          });

          return new Response(stream, {
            headers: {
              "x-access-token": localStorage.token
            }
          });
        })
        .catch(error => console.error("Error:", error))
        .then(newres => newres.json())
        .then(data => {
          if (data.status === 201) {
            let voted = "";
            let other = "";
            if (voteType === "U") {
              voted = data.voting_stats.votes_data.upvotes;
              other = data.voting_stats.votes_data.downvotes;
              let oname = "btnD" + questionId;
              let downBtn = document.querySelector(`[value=${oname}]`)
                .nextSibling;
              downBtn.textContent = " " + other;
            } else {
              voted = data.voting_stats.votes_data.downvotes;
              other = data.voting_stats.votes_data.upvotes;
              let oname = "btnU" + questionId;
              let upBtn = document.querySelector(`span[value=${oname}]`)
                .nextSibling;
              upBtn.textContent = " " + other;
            }
            let currentVoteCount = btn.nextSibling;
            currentVoteCount.textContent = voted;
          }

          if (data.status == 403) {
            if (data.message === "you cannot vote on your question") {
              message.style.color = "red";
              message.textContent = "You cannot vote on your question";
              btn.parentNode.setAttribute("style", "position: relative;");
              fadeIn(message);
              btn.parentNode.appendChild(message);
            }
          }

          if (
            data.status === 401 ||
            data.error == "Token is invalid or expired"
          ) {
            message.style.color = "red";
            message.textContent = "please login to continue";
            btn.parentNode.setAttribute("style", "position: relative;");
            fadeIn(message);
            btn.parentNode.appendChild(message);
            window.setTimeout(function () {
              location.href = "https://kburudi.github.io/Questioner--UI/UI/signin.html";
            }, 1000);
          }
        });
    });
  });
};

let goToComments = (meetup) => {
  let commentIcons = document.querySelectorAll("span.far.fa-comments")
  commentIcons.forEach(icon => {
    icon.addEventListener("click", e => {
      let voteSpan = icon.parentNode.previousSibling.childNodes[0]
      let currentQuesId = parseInt(voteSpan.getAttribute("value").substr(4))
      e.preventDefault()
      window.setTimeout(function () {
        location.href = `https://kburudi.github.io/Questioner--UI/UI/comments.html?meetup=${meetup}/question=${currentQuesId}/`;
      }, 300);
    })
  })
}

let getQuestions = () => {
  fetch(
      `https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}/questions`, {
        headers: {
          "x-access-token": localStorage.token,
          "Content-Type": "application/json"
        },
        method: "get"
      }
    )
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        let questionData = data.questions;
        questionData.forEach((question, i) => {
          let notFound = document.querySelector(".hide-later");
          if (notFound) {
            mainQuestionBox.removeChild(notFound);
          }
          let questionId = question.id;
          let button1Id = "btnU" + questionId;
          let button2Id = "btnD" + questionId;
          let askerData = question.asker;
          let singleQuestionBox = document.createElement("div");
          singleQuestionBox.classList.add("user-question");
          let userImageBox = document.createElement("div");
          userImageBox.classList.add("user-image-name");
          singleQuestionBox.appendChild(userImageBox);
          let userImage = document.createElement("img");
          userImage.classList.add("user-q-image");
          userImageBox.appendChild(userImage);
          let usernameSpan = document.createElement("span");
          usernameSpan.classList.add("user-name");
          userImageBox.appendChild(usernameSpan);
          userImage.setAttribute("src", askerData.image);
          usernameSpan.textContent = askerData.username;
          let questionTextBox = document.createElement("div");
          questionTextBox.classList.add("the-question");
          singleQuestionBox.appendChild(questionTextBox);
          let questionTitle = document.createElement("p");
          questionTextBox.appendChild(questionTitle);
          questionTitle.classList.add("question-title");
          let questionBody = document.createElement("p");
          questionBody.classList.add("question-body");
          questionTextBox.appendChild(questionBody);
          mainQuestionBox.removeChild(addQuestionBox);
          questionTitle.textContent = question.title;
          questionBody.textContent = question.body;
          mainQuestionBox.appendChild(singleQuestionBox);
          mainQuestionBox.appendChild(addQuestionBox);
          singleQuestionBox.appendChild(votingElements(button1Id, button2Id));
          let upVote =
            singleQuestionBox.childNodes[2].childNodes[0].childNodes[1];
          upVote.textContent = question.votes.upvotes;
          let downVote =
            singleQuestionBox.childNodes[2].childNodes[1].childNodes[1];
          downVote.textContent = question.votes.downvotes;
          let commentCount = singleQuestionBox.childNodes[2].childNodes[2].childNodes[1];
          commentCount.setAttribute("style", space)
          commentCount.textContent = question.comments
        });
        goToComments(meetupId)
      }
      voteQuestion();
      if (data.status === 404) {
        let noQuestionsAsked = document.createElement("div");
        noQuestionsAsked.classList.add("user-question", "hide-later");
        noQuestionsAsked.innerHTML = "";
        noQuestionsAsked.textContent = "NO Qustions asked yet";
        noQuestionsAsked.setAttribute(
          "style",
          "text-align: center; padding: 25px 35%;color: #000; font-size: 1.5em; width:80vw; margin-left: -20%;"
        );
        mainQuestionBox.removeChild(addQuestionBox);
        mainQuestionBox.appendChild(noQuestionsAsked);
        mainQuestionBox.appendChild(addQuestionBox);
      }
    });
};

getQuestions();

let checkRequired = () => {
  requiredFields.forEach(element => {
    element.addEventListener("blur", () => {
      let myValue = element.value;
      let inputParent = element.parentNode;
      let inputSiblings = inputParent.querySelector("span.error");
      error = inputSiblings;
      if (myValue.length == 0 || myValue.trim().lenght == 0) {
        element.style.border = "1px solid red";
        error.style.display = "inline-block";
        error.textContent = "Field is required";
      } else {
        error.style.display = "none";
        element.style.border = "1px solid #3877ea";
        if (myValue.trim() === "") {
          element.style.border = "1px solid red";
          error.style.display = "inline-block";
          error.textContent = "Cannot be whitespace only";
        }
      }
    });
  });

  submitButton.addEventListener("click", e => {
    e.preventDefault();
    requiredFields.forEach(element => {
      let myValue = element.value;
      let inputParent = element.parentNode;
      let inputSiblings = inputParent.querySelector("span.error");
      error = inputSiblings;
      if (myValue.length == 0 || myValue.trim().lenght == 0) {
        element.style.border = "1px solid red";
        error.style.display = "inline-block";
        error.textContent = "Field is required";
      } else {
        if (myValue.trim() === "") {
          element.style.border = "1px solid red";
          error.style.display = "inline-block";
          error.textContent = "Cannot be whitespace only";
        }
      }
    });
  });
};
checkRequired();

let postQuestion = () => {
  let titleInput = document.querySelector(".topic-input").value;
  let descInput = document.querySelector(".question-body-field").value;
  fetch(
      `https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}/questions`, {
        headers: {
          "x-access-token": localStorage.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: titleInput,
          body: descInput
        }),
        method: "post"
      }
    )
    .then(res => res.json())
    .then(data => {
      if (data.status === 201) {
        let notFound = document.querySelector(".hide-later");
        if (notFound) {
          mainQuestionBox.removeChild(notFound);
        }
        let askerData = data.asker;
        let singleQuestionBox = document.createElement("div");
        singleQuestionBox.classList.add("user-question");
        let userImageBox = document.createElement("div");
        userImageBox.classList.add("user-image-name");
        singleQuestionBox.appendChild(userImageBox);
        let userImage = document.createElement("img");
        userImage.classList.add("user-q-image");
        userImageBox.appendChild(userImage);
        let usernameSpan = document.createElement("span");
        usernameSpan.classList.add("user-name");
        userImageBox.appendChild(usernameSpan);
        userImage.setAttribute("src", askerData.image);
        usernameSpan.textContent = askerData.username;
        let questionTextBox = document.createElement("div");
        questionTextBox.classList.add("the-question");
        singleQuestionBox.appendChild(questionTextBox);
        let questionTitle = document.createElement("p");
        questionTextBox.appendChild(questionTitle);
        questionTitle.classList.add("question-title");
        let questionBody = document.createElement("p");
        questionBody.classList.add("question-body");
        questionTextBox.appendChild(questionBody);
        mainQuestionBox.removeChild(addQuestionBox);
        questionTitle.textContent = titleInput;
        questionBody.textContent = descInput;
        mainQuestionBox.appendChild(singleQuestionBox);
        mainQuestionBox.appendChild(addQuestionBox);
        singleQuestionBox.appendChild(votingElements());
        let upVote =
          singleQuestionBox.childNodes[2].childNodes[0].childNodes[1];
        upVote.textContent = 0;
        let downVote =
          singleQuestionBox.childNodes[2].childNodes[1].childNodes[1];
        downVote.textContent = 0;
        let commentCount = singleQuestionBox.childNodes[2].childNodes[2].childNodes[1];
        commentCount.setAttribute("style", space)
        commentCount.textContent = 0;
        let commentBox = singleQuestionBox.childNodes[2]
        commentBox.addEventListener("click", e => {
          e.preventDefault()
          commentBox.textContent = "reload to continue"
        })
      }
      voteQuestion();
      if (data.status === 401 || data.error == "Token is invalid or expired") {
        window.setTimeout(function () {
          location.href = "https://kburudi.github.io/Questioner--UI/UI/signin.html";
        }, 1000);
      }
    });
};

submitButton.addEventListener("click", e => {
  e.preventDefault();
  postQuestion();
  document.querySelector(".new-question-form").reset();
});