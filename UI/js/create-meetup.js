let mainPostSection = document.querySelector(".main-content-prof")
let message = ""
let pageNotFound = () => {
  if (window.location.href.split("?")[1] != "admins%20%only") {
    ("got it")
    let body = document.querySelector("body")
    body.innerHTML = "page not found"
  }
}

pageNotFound()

let requiredInputs = document.querySelectorAll(".required-field")
let checkRequired = () => {
  requiredInputs.forEach((field, i) => {
    let errorTag = field.nextElementSibling.nextElementSibling
    field.addEventListener("blur", e => {
      e.preventDefault()
      if (field.value.length === 0) {
        field.style.borderColor = "red"
        field.value == ''
        message = "field is required"
        errorTag.textContent = message
        errorTag.style.display = "inline-block";
      } else {
        errorTag = field.nextElementSibling.nextElementSibling
        errorTag.style.display = "none";
        field.style.border = "1px solid #3877ea";
        if (field.value.trim() === "") {
          field.style.borderColor = "1px solid red";
          errorTag.style.display = "inline-block";
          errorTag.textContent = "Cannot be whitespace only";
          field.style.borderColor = "red"
          field.value = ""
        }
      }
    })
  })
  createBtn.addEventListener("click", e => {
    e.preventDefault();
    requiredInputs.forEach((field, i) => {
      let errorTag = field.nextElementSibling.nextElementSibling
      if (field.value.length === 0) {
        field.style.borderColor = "red"
        field.value == ''
        message = "field is required"
        errorTag.textContent = message
        errorTag.style.display = "inline-block";
      }
    });
  });
}

let createBtn = document.querySelector(".create-button")
checkRequired()

let postMeetup = () => {
  createBtn.addEventListener("click", (e) => {
    e.preventDefault()
    let tagsToPost = []
    let imageToPost = []
    let tags = document.querySelector(".tags").value.split(",")
    let meetupImage = document.querySelector(".image").value
    if (meetupImage.trim().length > 0) {
      meetupImage = meetupImage.split("/")
      let imageError = document.querySelector(".image").nextElementSibling.nextElementSibling
      if (meetupImage.length <= 1) {
        imageError.textContent = "invalid image url"
        imageError.style.display = "block"
        document.querySelector(".image").style.borderColor = "red"
      } else {
        document.querySelector(".image").style.borderColor = "#3877ea"
        imageError.style.display = "none"
        document.querySelector(".image").addEventListener("blur", e => {
          document.querySelector(".image").style.borderColor = "#3877ea"
          imageError.style.display = "none"
        })
        imageToPost = [document.querySelector(".image").value]
      }
    } else {
      imageToPost = ["/home/zonecc/Desktop/Questioner-UI/UI/images/meetups/meetup-2.jpg"]
    }
    let meetupTopic = document.querySelector(".title").value + " "
    tags.forEach(tag => {
      if (tag.substr(0, 1) !== "#") {
        if (tag.length > 0) {
          tag = "#" + tag
          tagsToPost.push(tag)
        }
      }
    })
    if (tagsToPost.length === 0) {
      tagsToPost = ["#" + meetupTopic.split(" ")[0]]
    }
    fetch(`https://questioner--api.herokuapp.com/api/v2/meetups`, {
        headers: {
          "x-access-token": localStorage.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "topic": meetupTopic,
          "location": document.querySelector(".venue").value,
          "happen_on": document.querySelector(".time").value,
          "tags": tagsToPost,
          "image": imageToPost,
          "description": document.querySelector(".desc").value
        }),
        method: "post"
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 401) {
          if (data.error === "Token is invalid or expired" || data.error === "Token is missing") {
            window.setTimeout(function () {
              location.href = "https://kburudi.github.io/Questioner-UI/UI/signin.html";
            }, 1000);
          }
        }
        if (data.status === 201) {
          document.querySelector(".create-meetup-form").reset()
          window.setTimeout(function () {
            location.href = "https://kburudi.github.io/Questioner-UI/UI/meetupshome.html";
          }, 1500);
        }
      })
  })
}

postMeetup()