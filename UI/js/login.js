let requiredFields = document.querySelectorAll(".reg-input-fields");
let submitButton = document.querySelector(".reg-input-submit");

let checkRequired = () => {
  requiredFields.forEach(element => {
    element.addEventListener("blur", () => {
      let myValue = element.value;
      let inputParent = element.parentNode;
      let inputSiblings = inputParent.childNodes;
      error = inputSiblings[7];
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
      let inputSiblings = inputParent.childNodes;
      error = inputSiblings[7];
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

userLogin = () => {
  submitButton.addEventListener("click", e => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/api/v2/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: document.querySelector(".username").value,
          password: document.querySelector(".password").value
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status == 200) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("isAdmin", data.isAdmin);
          localStorage.setItem("currentUser", data.userId);
          let loggedInSuccess = document.createElement("p");
          loggedInSuccess.classList.add("loginsuccess");
          let loginTextPar = document.createElement("p");
          loggedInSuccess.appendChild(loginTextPar);
          loginTextPar.textContent =
            "logging in as " +
            document.querySelector(".username").value +
            " ...";
          let loadImage = document.createElement("img");
          loadImage.setAttribute("src", "images/loader/source.gif");
          loadImage.style.width = "100px";
          loadImage.style.height = "100px";
          loggedInSuccess.appendChild(loadImage);
          body = document.querySelector("body");
          body.appendChild(loggedInSuccess);
          body.style.opacity = "0.7";

          window.setTimeout(function () {
            if (document.referrer === "http://127.0.0.1:5500/signup.html" || document.referrer === "http://127.0.0.1:5500/index.html") {
              location.href = "http://127.0.0.1:5500/meetupshome.html";
            } else {
              history.back()
            }
          }, 1000);
        }

        if (data.status === 401) {
          if (data.error === "unregistered username") {
            let unameError = document.querySelector(".uname-error");
            unameError.textContent = data.error;
            unameError.style.display = "inline-block";
          }
          if (data.error === "incorrect password") {
            let passError = document.querySelector(".pass-error");
            passError.textContent = data.error;
            passError.style.display = "inline-block";
          }
        }
      });
  });
};
userLogin();