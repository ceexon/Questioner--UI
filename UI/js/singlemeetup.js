let currentUrl = window.location.href;
let meetupId = currentUrl.split("id=")[1];

let rsvpInfo = document.createElement("p");
rsvpInfo.setAttribute(
  "style",
  "width:200px; padding:20px; background-color:#f6f6f6; text-align: center; border: 1px solid #f3f3f3; position:fixed; display:none; left: 30%; top:40%;"
);

let fadeIn = el => {
  el.style.display = "block";
  window.setTimeout(function () {
    el.style.display = "none";
  }, 800);
};

let mainBody = document.querySelector("body");
mainBody.style.display = "none";

let monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

let meetupRsvpCount = document.querySelectorAll(".count-number");
meetupRsvpCount.forEach(el => {
  el.setAttribute("style", "font-size:20px;");
});
let yesCount = meetupRsvpCount[0];
let noCount = meetupRsvpCount[1];
let maybeCount = meetupRsvpCount[2];

let singleMeetupFetch = () => {
  fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}`, {
      method: "get",
      header: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      let meetupData = data.data;
      let allRsvpCounts = data.RSVPs;
      mainBody.style.display = "block";
      if (
        data.status === 404 ||
        data.status === 400 ||
        window.location.href.length === 1
      ) {
        mainBody.innerHTML = "";
        let errorFour04 = document.createElement("div");
        errorFour04.setAttribute(
          "style",
          "width: 100vw; height: 100vh; z-index: 6; background-color: #fff; font-size: 5em; color: #0d59a0; padding: 10% 0; position: fixed; top:0; bottom:0; left: 0; right: 0; text-align:center"
        );
        errorFour04.textContent = "Page Not Found..\n 404";
        mainBody.appendChild(errorFour04);
      }

      if (data.status === 200) {
        let meetupTopic = document.querySelector(".meetup-name");
        meetupTopic.textContent = meetupData.topic;
        let meetImage = document.querySelector(".meetup-image");
        meetImage.setAttribute("src", meetupData.image);
        let meetupDescription = document.querySelector(
          ".meetup-description .meetup-text"
        );
        meetupDescription.textContent = meetupData.description;
        let meetupVenue = document.querySelector(".Venue .venue-desc");
        meetupVenue.textContent = meetupData.location;
        let happenOnDate = document.querySelector(".Time .venue-desc");
        let theHappenTime = new Date(meetupData.happen_on);
        theHappenTime = theHappenTime.toString();
        let firstTimeSection = theHappenTime.substr(0, 15);
        let hourTime = theHappenTime.substr(16, 2);
        let minutesTime = theHappenTime.substr(19, 2);
        let displayTime =
          firstTimeSection + " " + hourTime + minutesTime + "HRS";
        happenOnDate.textContent = displayTime;
        let meetupTags = document.querySelector(".tags");
        let tags = meetupData.tags;
        tags.forEach(tag => {
          let singleTag = document.createElement("div");
          singleTag.classList.add("single-tag");
          singleTag.textContent = tag;
          singleTag.style.cursor = "pointer";
          meetupTags.appendChild(singleTag);
        });
        yesCount.textContent = allRsvpCounts.YES;
        noCount.textContent = allRsvpCounts.NO;
        maybeCount.textContent = allRsvpCounts.MAYBE;
      }
    });
};

singleMeetupFetch();

let meetupRsvpFetch = () => {
  let accessToken = localStorage.token;
  let rsvpValue = document.querySelectorAll(".rsvp");
  let userRsvp = "";
  rsvpValue.forEach(rsvp => {
    rsvp.addEventListener("click", e => {
      e.preventDefault();
      userRsvp = rsvp.name;
      fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}/rsvp`, {
          headers: {
            "x-access-token": accessToken,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: userRsvp
          }),
          method: "POST"
        })
        .then(response => response.json())
        .then(data => {
          let allRsvpCounts = data.rsvpData;
          if (data.status === 403) {
            rsvpInfo.textContent = "You have already rsvped " + userRsvp;
            rsvpInfo.style.color = "red";
            fadeIn(rsvpInfo);
            mainBody.appendChild(rsvpInfo);
          }

          if (data.status === 201) {
            rsvpInfo.textContent = "You have rsvped " + userRsvp;
            rsvpInfo.style.color = "green";
            fadeIn(rsvpInfo);
            mainBody.appendChild(rsvpInfo);
          }
          if (
            data.status === 401 ||
            data.error == "Token is invalid or expired"
          ) {
            rsvpInfo.textContent = "please login to continue";
            rsvpInfo.style.color = "red";
            fadeIn(rsvpInfo);
            mainBody.appendChild(rsvpInfo);
            window.setTimeout(function () {
              location.href = "https://kburudi.github.io/Questioner-UI/UI/gitsignin.html";
            }, 1000);
          }
          yesCount.textContent = allRsvpCounts.YES;
          noCount.textContent = allRsvpCounts.NO;
          maybeCount.textContent = allRsvpCounts.MAYBE;
        });
    });
  });
};

meetupRsvpFetch();