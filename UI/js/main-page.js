fetchMeetup = () => {
  fetch("https://questioner--api.herokuapp.com/api/v2/meetups/upcoming", {
      method: "get",
      header: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        let meetupData = data.data;
        meetupData = meetupData.slice(0, 6)
        for (meetId = 0; meetId < meetupData.length; meetId++) {
          currentMeetup = meetupData[meetId];
          let meetupId = currentMeetup.id
          let imageUrl = currentMeetup.image[0];
          let topicText = currentMeetup.topic;
          let textDesc = currentMeetup.description.substr(0, 100) + "...";
          let meetupsMainContainer = document.querySelector(
            ".all-meetups-box"
          );
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
          let readMore = document.createElement("a");
          readMore.classList.add("read-more");
          readMore.setAttribute("href", "#");
          readMore.textContent = "read more ";
          let readMoreArrow = document.createElement("span");
          readMoreArrow.setAttribute("class", "fas fa-arrow-right");
          readMore.appendChild(readMoreArrow);
          meetupTextBox.appendChild(readMore);
          let readMoreLine = document.querySelector(".read-more-line");
          meetupsMainContainer.removeChild(readMoreLine);
          meetupsMainContainer.appendChild(readMoreLine);
          let meetupIdHidden = document.createElement("span");
          meetupIdHidden.classList.add("meetup-id");
          meetupIdHidden.textContent = currentMeetup.id
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
            fetch(`https://questioner--api.herokuapp.com/api/v2/meetups/${meetupId}`, {
                method: "get",
                header: {
                  "Content-Type": "application/json"
                }
              })
              .then(response => response.json())
              .then(data => {
                window.setTimeout(function () {
                  location.href = `https://kburudi.github.io/Questioner-UI/UI/meetups.html?id=${meetupId}`
                }, 200);
              })
          })
        }
      }
    });
};

fetchMeetup();