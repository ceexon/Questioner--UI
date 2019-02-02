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
        if (meetupData[0]) {
          meetupOne = meetupData[0];
          let meetupImageUrl = meetupOne.image[0];
          let meetupTopic = meetupOne.topic;
          let meetupDescription = meetupOne.description.substr(0, 100) + "...";

          let firstImage = document.querySelector(".meetup-image");
          firstImage.setAttribute("src", meetupImageUrl);
          let firstTopic = document.querySelector(".meetup-title");
          firstTopic.textContent = meetupTopic;
          let firstDescription = document.querySelector(".text-desc-part");
          firstDescription.textContent = meetupDescription;
        }

        if (meetupData.length > 1) {
          for (meetId = 1; meetId < meetupData.length; meetId++) {
            currentMeetup = meetupData[meetId];
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
          }
        }
      }
    });
};

fetchMeetup();