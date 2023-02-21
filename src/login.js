(function eraseCookie(name) {
  document.cookie =
    "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
})();

const loginSubmit = document.getElementById("login-submit");

const loginSubmitFunction = async function (e) {
  e.preventDefault();

  const loginEmail = document.querySelector("#login-email").value;
  const loginPassword = document.querySelector("#login-password").value;

  let user = JSON.stringify({
    email: loginEmail,
    password: loginPassword,
  });

  let myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: user,
  };

  //fetch call to check whether to login user or not
  let response = await fetch(
    "http://localhost:3000/users/login",
    requestOptions
  )
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      if (result.error) {
        return alert(result.error);
      } else {
        console.log("Logged in successfully");
        document.cookie = setCookie(
          "access_token",
          result.token,
          1000 * 60 * 10
        ); //set cookie for authorization
        window.location.assign("http://127.0.0.1:5500/Pokedex/index.html");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

function setCookie(name, value, sec) {
  var expires = "";
  if (sec) {
    var date = new Date();
    date.setTime(date.getTime() + sec);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

loginSubmit.addEventListener("submit", loginSubmitFunction);
