async function handleRegister() {
  event.preventDefault();
  let textErrorEmail = document.querySelector(".textErrorEmail");
  let textErrorButton = document.querySelector(".textErrorButton");
  let firstName = document.querySelector(".firstName").value;
  let lastName = document.querySelector(".lastName").value;
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;

  let textError = document.createElement("p");
  textError.classList.add("textError");

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newUser),
  };

  let apiRequest = await fetch("http://localhost:3000/user/register", request);
  let response = await apiRequest;
  if (response.status === 201) {
    let id = await apiRequest.json();
    id = id.result.insertedId;
    localStorage.setItem("_id", id);
    window.location.href = "../Index/index.html";
  } else {
    let msgError = await apiRequest.json();
    if (response.status === 400 && msgError.error === "please send a email") {
      textErrorEmail.innerText = "Veuillez rentrer un email";
      textErrorButton.innerText = "";
    } else if (response.status === 400 && msgError.error === "Missing fields") {
      textErrorButton.innerText = "Veuillez remplir les champs";
      textErrorEmail.innerText = "";
      checkbox.appendChild(textError);
    } else if (response.status === 401) {
      textErrorEmail.innerText = "Email déja utiliser";
      textErrorButton.innerText = "";
    } else {
      textErrorButton.innerText = "Error";
      textErrorEmail.innerText = "";
    }
  }
}
