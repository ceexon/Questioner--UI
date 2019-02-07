let submitButton = document.querySelector(".reg-input-submit");
let successMessage = document.createElement("p");
successMessage.classList.add("success");
let requiredFields = document.querySelectorAll(".required-field");

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
      }
    });
  });
};

checkRequired();

let userSignUp = () => {
  submitButton.addEventListener("click", e => {
    let genderValue = document.querySelectorAll("input[name='gender']");
    genderValue.forEach(e => {
      if (e.checked === true) {
        genderValue = e.value;
      }
    });
    let thePassword = document.querySelector("#password");
    let confPassword = document.querySelector("#cpassword");
    if (thePassword.value != confPassword.value) {
      e.preventDefault();
      let cpassError = document.querySelector(".cpass-error");
      cpassError.textContent = "passwords do not match";
      cpassError.style.display = "inline-block";
    } else {
      e.preventDefault();
      fetch("https://questioner--api.herokuapp.com/api/v2/auth/signup", {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            firstname: document.getElementById("fname").value,
            lastname: document.getElementById("lname").value,
            othername: document.getElementById("other").value,
            username: document.getElementById("uname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            gender: genderValue,
            password: document.getElementById("password").value
          })
        })
        .then(res => res.json())
        .then(data => {
          successMessage.textContent = "User created successfully";
          ("outside");
          if (data.status === 201) {
            body = document.querySelector("body");
            body.appendChild(successMessage);
            ("here");
            window.setTimeout(function () {
              location.href = "https://kburudi.github.io/Questioner-UI/UI/signin.html";
            }, 1000);

            requiredFields.forEach(element => {
              let myValue = element.value;
              myValue.textContent = "";
            });
          }

          //handle 409 conflicts
          if (data.status === 409) {
            if (data.error === "user with username exists") {
              let unameError = document.querySelector(".uname-error");
              unameError.textContent = data.error;
              unameError.style.display = "inline-block";
            }
            if (data.error === "user with email exists") {
              let passError = document.querySelector(".email-error");
              passError.textContent = data.error;
              passError.style.display = "inline-block";
            }
          }

          //handle 422 errors
          if (data.status === 422) {
            if (data.error === "invalid password") {
              let passError = document.querySelector(".pass-error");
              passError.textContent = data.message;
              passError.style.display = "inline-block";
            }

            if (data.error === "invalid naming format") {
              let nameError = document.querySelectorAll(".name-error");
              nameError.forEach(e => {
                let parentContainer = e.parentNode;
                let siblings = parentContainer.childNodes;
                let nameValue = siblings[1].value.trim();
                if (!/^[a-z]+$/i.test(nameValue)) {
                  e.textContent = "can only be letters";
                  e.style.display = "inline-block";
                }
              });
            }
            if (data.error === "invalid phone number") {
              let phoneError = document.querySelector(".phone-error");
              phoneError.textContent = data.message;
              phoneError.style.display = "inline-block";
            }

            if (data.error === "username can only be a letter, digit or _") {
              let unameError = document.querySelector(".uname-error");
              unameError.textContent = data.error;
              unameError.style.display = "inline-block";
            }

            if (data.message === "bad email format") {
              let passError = document.querySelector(".email-error");
              passError.textContent = data.error;
              passError.style.display = "inline-block";
            }
          }
        });
    }
  });
};

userSignUp();