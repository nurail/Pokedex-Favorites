(function eraseCookie(name) {
  document.cookie =
    "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
})();

const registerSubmit = document.getElementById("register-new-user-button");

const registerUserFunction = async function (e) {
  e.preventDefault();

  let registerFirstName =
    document.querySelector("#register-first-name").value || "";
  let registerLastName =
    document.getElementById("register-last-name").value || "";
  let registerUsername = document.getElementById("register-username").value;
  let registerDoB = document.getElementById("register-dob").value || "";
  let registerEmail = document.getElementById("register-email").value;
  let registerPassword = document.getElementById("register-password").value;
  let registerPasswordConfirmation = document.getElementById(
    "register-confirmation-password"
  ).value;

  let user = {
    firstName: registerFirstName,
    lastName: registerLastName,
    username: registerUsername,
    birthday: registerDoB,
    email: registerEmail,
    password: registerPassword,
    registerPasswordConfirmation,
  };
  let myHeaders = { "Content-Type": "application/json" };

  //checking if both passwords entered match
  if (registerPassword !== registerPasswordConfirmation) {
    alert("The passwords do not match");
    registerPassword = "";
    registerPasswordConfirmation = "";
  } else {
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user),
    };

    //fetch call to register new user
    let response = await fetch("http://localhost:3000/users", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          console.log(result.error);
          return alert(result.error);
        }
        window.location.assign("http://localhost:5500/views/main.html");
        alert("New user created successfully");
      })
      .catch((error) => console.error("Error:", error));
  }
};

registerSubmit.addEventListener("click", registerUserFunction);
