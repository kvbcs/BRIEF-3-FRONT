async function handleRegister() {
  event.preventDefault();
  let textErrorEmail = document.querySelector(".textErrorEmail");
  let textErrorButton = document.querySelector(".textErrorButton");
  let firstName = document.querySelector(".firstName").value;
  let lastName = document.querySelector(".lastName").value;
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;
  //création du message d'erreur
  let textError = document.createElement("p");
  textError.classList.add("textError");
  //Création du body pour la requete
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };
  //Création de la requete à envoyé au back
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newUser),
  };
  //Communication afin d'enregistrer dans la base de donnée le nouveau utilisateur
  let apiRequest = await fetch("http://localhost:3000/user/register", request);
  let response = await apiRequest;
  if (response.status === 201) {
    //si requete accepter
    let id = await apiRequest.json();
    id = id.result.insertedId;
    localStorage.setItem("_id", id);
    window.location.href = "../Index/index.html";
  } else {
    //sinon on récupere le message d'erreur
    let msgError = await apiRequest.json();
    //Si le validator email renvoie une erreur
    if (response.status === 400 && msgError.error === "please send a email") {
      textErrorEmail.innerText = "Veuillez rentrer un email";
      textErrorButton.innerText = "";
      //Sinon si les champs ne sont pas tous remplie
    } else if (response.status === 400 && msgError.error === "Missing fields") {
      textErrorButton.innerText = "Veuillez remplir les champs";
      textErrorEmail.innerText = "";
      checkbox.appendChild(textError);
      //Sinon si l'email est déja utiliser, on n'autorise pas l'inscription
    } else if (response.status === 401) {
      textErrorEmail.innerText = "Email déja utiliser";
      textErrorButton.innerText = "";
    } else {
      textErrorButton.innerText = "Error";
      textErrorEmail.innerText = "";
    }
  }
}
