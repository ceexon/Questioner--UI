let mainQuestionBox = document.querySelector(".questions-box")
let addQuestionBox = document.querySelector(".add-new-question")

let getQuestions = () => {
  fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}/questions`, {
      headers: {
        "x-access-token": localStorage.token,
        "Content-Type": "application/json"
      },
      method: "get"
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        let questionData = data.questions
        questionData.forEach(question => {
          let notFound = document.querySelector(".hide-later")
          if (notFound) {
            mainQuestionBox.removeChild(notFound)
          }
          let askerData = question.asker
          let singleQuestionBox = document.createElement("div")
          singleQuestionBox.classList.add("user-question")
          let userImageBox = document.createElement("div")
          userImageBox.classList.add("user-image-name")
          singleQuestionBox.appendChild(userImageBox)
          let userImage = document.createElement("img")
          userImage.classList.add("user-q-image")
          userImageBox.appendChild(userImage)
          let usernameSpan = document.createElement("span")
          usernameSpan.classList.add("user-name")
          userImageBox.appendChild(usernameSpan)
          userImage.setAttribute("src", askerData.image)
          usernameSpan.textContent = askerData.username
          let questionTextBox = document.createElement("div")
          questionTextBox.classList.add("the-question")
          singleQuestionBox.appendChild(questionTextBox)
          let questionTitle = document.createElement("p")
          questionTextBox.appendChild(questionTitle)
          questionTitle.classList.add("question-title")
          let questionBody = document.createElement("p")
          questionBody.classList.add("question-body")
          questionTextBox.appendChild(questionBody)
          mainQuestionBox.removeChild(addQuestionBox)
          questionTitle.textContent = question.title
          questionBody.textContent = question.body
          mainQuestionBox.appendChild(singleQuestionBox)
          mainQuestionBox.appendChild(addQuestionBox)
        });
      }
      if (data.status === 404) {
        let noQuestionsAsked = document.createElement("div")
        noQuestionsAsked.classList.add("user-question", "hide-later")
        noQuestionsAsked.innerHTML = ""
        noQuestionsAsked.textContent = "NO Qustions asked yet"
        noQuestionsAsked.setAttribute("style", "text-align: center; padding: 25px 35%;color: #000; font-size: 1.5em; width:80vw; margin-left: -20%;")
        mainQuestionBox.removeChild(addQuestionBox)
        mainQuestionBox.appendChild(noQuestionsAsked)
        mainQuestionBox.appendChild(addQuestionBox)
      }
    })
}

getQuestions()

requiredFields = document.querySelectorAll(".question-input")
let submitButton = document.querySelector(".create-button")


let checkRequired = () => {
  requiredFields.forEach(element => {
    element.addEventListener("blur", () => {
      let myValue = element.value;
      let inputParent = element.parentNode;
      let inputSiblings = inputParent.querySelector("span.error")
      error = inputSiblings
      if (myValue.length == 0 || myValue.trim().lenght == 0) {
        element.style.border = "1px solid red"
        error.style.display = "inline-block"
        error.textContent = "Field is required"
      } else {
        error.style.display = "none"
        element.style.border = "1px solid #3877ea"
        if (myValue.trim() === '') {
          element.style.border = "1px solid red"
          error.style.display = "inline-block"
          error.textContent = "Cannot be whitespace only"
        }
      }
    })
  });

  submitButton.addEventListener("click", e => {
    e.preventDefault()
    requiredFields.forEach(element => {
      let myValue = element.value;
      let inputParent = element.parentNode;
      let inputSiblings = inputParent.querySelector("span.error")
      error = inputSiblings
      if (myValue.length == 0 || myValue.trim().lenght == 0) {
        element.style.border = "1px solid red"
        error.style.display = "inline-block"
        error.textContent = "Field is required"
      } else {
        if (myValue.trim() === '') {
          element.style.border = "1px solid red"
          error.style.display = "inline-block"
          error.textContent = "Cannot be whitespace only"
        }
      }
    })

  })
}
checkRequired()

let postQuestion = () => {
  let titleInput = document.querySelector(".topic-input").value
  let descInput = document.querySelector(".question-body-field").value
  fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}/questions`, {
      headers: {
        "x-access-token": localStorage.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "title": titleInput,
        "body": descInput
      }),
      method: "post"
    })
    .then(res => res.json())
    .then(data => {

      if (data.status === 201) {
        let askerData = data.asker
        let singleQuestionBox = document.createElement("div")
        singleQuestionBox.classList.add("user-question")
        let userImageBox = document.createElement("div")
        userImageBox.classList.add("user-image-name")
        singleQuestionBox.appendChild(userImageBox)
        let userImage = document.createElement("img")
        userImage.classList.add("user-q-image")
        userImageBox.appendChild(userImage)
        let usernameSpan = document.createElement("span")
        usernameSpan.classList.add("user-name")
        userImageBox.appendChild(usernameSpan)
        userImage.setAttribute("src", askerData.image)
        usernameSpan.textContent = askerData.username
        let questionTextBox = document.createElement("div")
        questionTextBox.classList.add("the-question")
        singleQuestionBox.appendChild(questionTextBox)
        let questionTitle = document.createElement("p")
        questionTextBox.appendChild(questionTitle)
        questionTitle.classList.add("question-title")
        let questionBody = document.createElement("p")
        questionBody.classList.add("question-body")
        questionTextBox.appendChild(questionBody)
        mainQuestionBox.removeChild(addQuestionBox)
        questionTitle.textContent = titleInput
        questionBody.textContent = descInput
        mainQuestionBox.appendChild(singleQuestionBox)
        mainQuestionBox.appendChild(addQuestionBox)
      }
    })
}

submitButton.addEventListener("click", e => {
  e.preventDefault()
  postQuestion()
  document.querySelector(".new-question-form").reset()
})