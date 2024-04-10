// element d'une div qu'on va ajouter le text error
let textError = document.querySelector(".checkbox");
//si on à déja un _id local storage, on l'enleve
localStorage.removeItem("_id");
async function handleLogin() {
  event.preventDefault();
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;
  //création du body pour la requete
  let newUser = {
    email: email,
    password: password,
  };
  //creation de la requete à envoié au back
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newUser),
  };

  //Essaie de communication afin de vérifier si les informations correspondent
  let apiRequest = await fetch("http://localhost:3000/user/login", request);
  let response = await apiRequest;
  let msgError;
  console.log(msgError);
  //Si sa corréspond stockage de l'id user dans le local storage et redirection vers la page d'acceuil
  if (response.status === 200) {
    let id = await apiRequest.json();
    localStorage.setItem("_id", id._id);
    window.location.href = "../Index/index.html";
    //sinon si sa corréspond à des erreur on ajoute un message d'erreur visible qui correspond
  } else {
    msgError = await apiRequest.json();
    if (response.status === 401) {
      textError.innerText = "Email or password invalid";
    } else if (response.status === 400 && msgError.error === "Missing fields") {
      textError.innerText = "Veuillez remplir les champs";
    } else if (
      response.status === 400 &&
      msgError.error === "please send a email"
    ) {
      textError.innerText = "Veuillez rentrer un Email";
    } else {
      textError.innerText = "Error";
    }
  }
}
