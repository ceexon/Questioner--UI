let addDays = (dateObj, numDays) => {
  dateObj.setDate(dateObj.getDate() + numDays);
  return dateObj;
}

let monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// today
let today = new Date();
let monthToday = monthNames[today.getMonth()];
let dateToday = today.getDate()
let yearToday = today.getFullYear()

// next seven days
let oneWeek = addDays(today, 7);
let monthNextWeek = monthNames[today.getMonth()];
let dateNextWeek = today.getDate()
let yearNextWeek = today.getFullYear()

// next 14 days
let twoWeeks = addDays(today, 7);
let monthTwoWeeks = monthNames[today.getMonth()];
let dateTwoWeeks = today.getDate()
let yearTwoWeeks = today.getFullYear()

// next 21 days
let threeWeeks = addDays(today, 7);
let monthThreeWeeks = monthNames[today.getMonth()];
let dateThreeWeeks = today.getDate()
let yearThreeWeeks = today.getFullYear()

let monthSet = [monthToday, monthNextWeek, monthTwoWeeks, monthThreeWeeks]
let dateSet = [dateToday, dateNextWeek, dateTwoWeeks, dateThreeWeeks]
let yearSet = [yearToday, yearNextWeek, yearTwoWeeks, yearThreeWeeks]

document.getElementById("week-1").textContent = dateToday + ' ' + monthToday + ' ' + yearToday + ' - ' + dateNextWeek + ' ' + monthNextWeek + ' ' + yearNextWeek

let eventDateDiffs = document.querySelectorAll(".dates-between")
eventDateDiffs.forEach((el, i) => {
  let dateStart = dateSet[i] + ' ' + monthSet[i] + ' ' + yearSet[i] + ' - '
  let dateFinish = ""
  if (i < 2) {
    dateFinish = dateSet[i + 1] + ' ' + monthSet[i + 1] + ' ' + yearSet[i + 1]
  } else {
    dateFinish = "later"
  }
  el.textContent = dateStart + dateFinish
});

fetchMeetup = () => {
  fetch("https://questioner--api.herokuapp.com/api/v2/meetups/upcoming", {
      method: "get",
      header: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      let allMeetups = data.data;
      let meetupsMainContainer = ""
      let oneWeekMeetups = []
      let twoWeekMeetups = []
      let threeWeekMeetups = []
      allMeetups.forEach((meetup, i) => {
        let today = new Date()
        let happenDate = new Date(meetup.happen_on)
        let secondDifference = happenDate - today
        let dayDifference = secondDifference / 8.64e+7
        let meetupSections = document.querySelectorAll(".upcoming-events")
        let meetupDivContainers = document.querySelectorAll(".all-meetups-box")
        currentMeetup = meetup;
        let imageUrl = currentMeetup.image[0];
        let topicText = currentMeetup.topic;
        let textDesc = currentMeetup.description.substr(0, 100) + "...";
        if (dayDifference <= 7) {
          meetupsMainContainer = meetupDivContainers[0]
          oneWeekMeetups.push(currentMeetup)
        } else if (dayDifference > 7 && dayDifference <= 14) {
          meetupsMainContainer = meetupDivContainers[1]
          twoWeekMeetups.push(currentMeetup)
        } else if (dayDifference > 14) {
          meetupsMainContainer = meetupDivContainers[2]
          threeWeekMeetups.push(currentMeetup)
        }

        let meetupBox = document.createElement("div");
        meetupBox.classList.add("meetup-box-rep");
        meetupsMainContainer.appendChild(meetupBox);
        let meetupImageBox = document.createElement("div");
        meetupImageBox.classList.add("meetup-image-box");
        meetupBox.appendChild(meetupImageBox);
        let meetupImage = document.createElement("img");
        meetupImage.classList.add("meetup-image");
        meetupImage.setAttribute("src", imageUrl);
        meetupImageBox.appendChild(meetupImage);
        let meetupTextBox = document.createElement("div");
        meetupTextBox.classList.add("meetup-text");
        meetupBox.appendChild(meetupTextBox);
        let meetupTopic = document.createElement("h3");
        meetupTopic.classList.add("meetup-title");
        meetupTextBox.appendChild(meetupTopic);
        meetupTopic.textContent = topicText;
        let meetupDescription = document.createElement("p");
        meetupDescription.classList.add("text-desc-part");
        meetupTextBox.appendChild(meetupDescription);
        meetupDescription.textContent = textDesc;
        let meetupIdHidden = document.createElement("span");
        meetupIdHidden.classList.add("meetup-id");
        meetupIdHidden.textContent = meetup.id
        meetupTextBox.appendChild(meetupIdHidden);
        meetupIdHidden.style.display = "none";

        // events to single created meetup
        meetupBox.addEventListener("mouseover", (e) => {
          e.preventDefault()
          meetupBox.style.cursor = "pointer";
          meetupBox.style.opacity = "0.7";
        })
        meetupBox.addEventListener("mouseout", (e) => {
          e.preventDefault()
          meetupBox.style.opacity = "1";
        })
        meetupBox.addEventListener("click", (e) => {
          e.preventDefault()
          let meetupId = meetup.id
          fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}`, {
              method: "get",
              header: {
                "Content-Type": "application/json"
              }
            })
            .then(response => response.json())
            .then(data => {
              function ChangeUrl(page, url) {
                if (typeof (history.pushState) != "undefined") {
                  var obj = {
                    Page: page,
                    Url: url
                  };
                  history.pushState(obj, obj.Page, obj.Url);
                } else {
                  alert("Browser does not support HTML5.");
                }
              }
              window.setTimeout(function () {
                location.href = `https://kburudi.github.io/Questioner-UI/UI/meetups.html?id=${meetupId}`
              }, 200);
            })
        })
      })
    })
}

fetchMeetup()