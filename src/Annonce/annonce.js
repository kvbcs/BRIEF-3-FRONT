async function handleAnnonce() {
  //bloque le bouton envoie
  event.preventDefault();
  //récupération des element
  let title = document.querySelector(".title");
  let image = document.querySelector("#image");
  let messageError = document.querySelector(".messageError");
  let description = document.querySelector(".description");

  // creation d'objet qui stocke les valeurs des élements
  let newAnnonce = {
    titre: title.value,
    image: image.value,
    description: description.value,
    idUser: localStorage.getItem("_id"),
  };
  //création de la requete
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newAnnonce),
  };

  try {
    //Essaie de communication avec le back
    let apiRequest = await fetch(
      "http://localhost:3000/annonce/create",
      request
    );
    //réponse du back
    let response = await apiRequest;
    //réponse du message en cas d'erreur
    let msgError = await apiRequest.json();
    //si le statut de la réponse est 201 alors l'annonce à été créer dans la base de donnée
    if (response.status === 201) {
      //renvoie vers l'accueil
      window.location.href = "../Index/index.html";
    } else if (
      //sinon si status 400 et que le message d'erreur et l'erreur du validator url
      response.status === 400 &&
      msgError.error === "please send a url"
    ) {
      // ajout d'une classe qui à un before afin de signaler l'erreur de l'url
      document.querySelector("#labelImage").classList.add("labelImage");
      messageError.innerText = "";
    } else if (response.status === 400) {
      //message erreur remplir tous les champs
      messageError.innerText = "Veuillez remplir tous les champs";
      document.querySelector("#labelImage").classList.remove("labelImage");
    } else {
      //sinon renvoie vers la page de connexion car on suppose qu'il n'est pas connecter
      window.location.href = "../Login/login.html";
    }
  } catch (e) {
    console.log(e);
  }
}
