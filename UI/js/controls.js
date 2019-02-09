document.querySelector("#header").style.marginBottom = 0
let mainTable = document.querySelector(".data-table")
let hederRow = document.querySelector(".th-row")
let mainBody = document.querySelector("body")
let fetchAllMeetups = () => {
  fetch("https://questioner--api.herokuapp.com/api/v2/meetups/all", {
      headers: {
        "x-access-token": localStorage.token
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        console.log("ok")
        let allMeetups = data.data
        allMeetups.forEach(meetup => {
          let meetupCreator = meetup.user_id
          let meetupTopic = meetup.topic
          let meetupId = meetup.id
          let meetupLocation = meetup.location
          let happenDate = new Date(meetup.happen_on).toString().substr(0, 21)
          let createDate = new Date(meetup.created_on).toString().substr(0, 21)
          let meetupTags = meetup.tags
          let meetupImage = meetup.image
          let meetupDesc = meetup.description

          let currentRow = document.createElement("tr")
          let currentRowData1 = document.createElement("td")
          currentRowData1.textContent = meetupId
          let currentRowData2 = document.createElement("td")
          currentRowData2.textContent = meetupTopic
          let currentRowData3 = document.createElement("td")
          currentRowData3.textContent = meetupLocation
          let currentRowData4 = document.createElement("td")
          currentRowData4.textContent = happenDate
          let currentRowData5 = document.createElement("td")
          currentRowData5.textContent = meetupCreator
          let currentRowData6 = document.createElement("td")
          let editBtn = document.createElement("span")
          editBtn.classList.add("fas", "fa-edit", "smallData")
          currentRowData6.appendChild(editBtn)
          let currentRowData7 = document.createElement("td")
          currentRowData6.classList.add("smallData")
          currentRowData7.classList.add("smallData")
          let deleteBtn = document.createElement("span")
          deleteBtn.classList.add("fas", "fa-trash", "smallData")
          currentRowData7.appendChild(deleteBtn)
          currentRow.appendChild(currentRowData1)
          currentRow.appendChild(currentRowData2)
          currentRow.appendChild(currentRowData3)
          currentRow.appendChild(currentRowData4)
          currentRow.appendChild(currentRowData5)
          currentRow.appendChild(currentRowData6)
          currentRow.appendChild(currentRowData7)
          currentRow.style.color = "#606060";
          mainTable.appendChild(currentRow)
          let goToMeetup = document.createElement("a")
          goToMeetup.textContent = "see meetup"
          goToMeetup.classList.add("see-meetup")
          currentRow.addEventListener("mouseover", e => {
            e.preventDefault()
            currentRow.style.backgroundColor = "#f3f3f3";
            currentRow.style.color = "#000";
            currentRow.appendChild(goToMeetup)
            goToMeetup.style.display = "block"
          })
          currentRow.addEventListener("mouseleave", e => {
            e.preventDefault()
            currentRow.style.backgroundColor = "#fff";
            currentRow.style.color = "#606060";
            goToMeetup.style.display = "none"
          })

          let meetupDataKeys = ["id", "topic", "location", "happen on", "tags", "description", "image", "creator", "created on"]
          let dataValues = [meetupId, meetupTopic, meetupLocation, happenDate, meetupTags, meetupDesc, meetupImage, meetupCreator, createDate]
          let ligthBox = document.createElement("div")
          ligthBox.classList.add("lightbox")
          let meetupData = document.createElement("section")
          meetupData.classList.add("meetupLightbox")
          let meetupForm = document.createElement("form")
          meetupForm.classList.add("meetup-form")
          let hideLightBox = document.createElement("span")
          hideLightBox.classList.add("fas", "fa-times", "hideLightbox")
          ligthBox.appendChild(hideLightBox)

          let submitContainer = document.createElement("div")
          submitContainer.classList.add("row-container", "change-not")
          let cancelBtn = document.createElement("a")
          cancelBtn.textContent = "Cancel"
          let applyBtn = document.createElement("a")
          applyBtn.textContent = "Make Changes"
          submitContainer.appendChild(cancelBtn)
          submitContainer.appendChild(applyBtn)
          let hide = () => {
            ligthBox.style.display = "none"
            meetupForm.innerHTML = ""
            ligthBox.textContent = ""
          }
          let hideLiteBox = () => {
            hideLightBox.addEventListener("click", () => {
              hide()
            })
            cancelBtn.addEventListener("click", () => {
              hide()
            })
            if (ligthBox.style.display === "block") {
              ligthBox.addEventListener("click", e => {
                if (e.target.classList[0] === "lightbox") {
                  hide()
                }
              })
            }
          }

          currentRowData6.addEventListener("click", e => {
            e.preventDefault()
            ligthBox.style.display = "block"
            mainBody.appendChild(ligthBox)
            ligthBox.appendChild(meetupData)
            meetupData.appendChild(meetupForm)
            meetupDataKeys.forEach((dataKey, i) => {
              let keyLabel = document.createElement("label")
              keyLabel.setAttribute("for", dataKey)
              keyLabel.classList.add("key-label")
              keyLabel.textContent = dataKey + " : "
              let keyField = ""
              if (dataKey === "description") {
                keyField = document.createElement("textarea")
                keyField.classList.add("desc-box")
                keyField.setAttribute("rows", 9)
              } else {
                keyField = document.createElement("input")
              }

              if (dataKey === "id" || dataKey === "creator" || dataKey === "created on") {
                keyField.setAttribute("disabled", "disabled")
              }

              keyField.classList.add("data-fields")
              keyField.setAttribute("name", dataKey)
              keyField.value = dataValues[i]
              let rowCon = document.createElement("div")
              rowCon.classList.add("row-container")
              rowCon.appendChild(keyLabel)
              rowCon.appendChild(keyField)
              meetupForm.appendChild(rowCon)
            })

            meetupForm.appendChild(submitContainer)
            hideLiteBox()
          })
          currentRowData7.addEventListener("click", e => {
            e.preventDefault()
            console.log("here")
            mainBody.appendChild(ligthBox)
            let confirmAction = document.createElement("div")
            confirmAction.setAttribute("style", "width: 350px; padding: 10px; background-color: #fff; margin: 15% auto")
            let sureMessage = document.createElement("p")
            sureMessage.textContent = `Are  you sure you want to delete this meetup with id - ${meetupId} and topic - ${meetupTopic}`
            sureMessage.setAttribute("style", "width: 300px; text-align:center; margin: 10px auto 20px;")
            ligthBox.style.display = "block"
            applyBtn.textContent = "Delete"
            confirmAction.appendChild(sureMessage)
            confirmAction.appendChild(submitContainer)
            ligthBox.appendChild(confirmAction)
            hideLiteBox()
            applyBtn.addEventListener("click", e => {
              e.preventDefault()
              deleteMeetup(meetupId)
              window.setTimeout(function () {
                confirmAction.textContent = "meetup has been deleted"
                hide()
                window.location.href = window.location.href
              }, 400);
            })
          })
          goToMeetup.addEventListener("click", e => {
            window.setTimeout(function () {
              location.href = `https://kburudi.github.io/Questioner-UI/UI/meetups.html?id=${meetupId}`;
            }, 200);
          })

        });
      }

    })
}

fetchAllMeetups()

function deleteMeetup(meetupId) {
  console.log(meetupId)
  fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}`, {
      method: "delete",
      headers: {
        "x-access-token": localStorage.token
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {

      } else {
        localStorage.token = undefined
        mainBody.innerHTML = "An error has occured.Login and start again"
        window.setTimeout(function () {
          location.href = `https://kburudi.github.io/Questioner-UI/UI/signin.html`;
        }, 600);
      }
    })
}