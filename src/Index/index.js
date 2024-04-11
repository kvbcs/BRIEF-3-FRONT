const body = document.querySelector("body");
const main = document.querySelector("main");
const disconnectButton = document.querySelector(".disconnect");
const register = document.querySelector(".btn-register");
const login = document.querySelector(".btn-login");
let id = localStorage.getItem("_id");

async function getAnnonces() {
  //récupération de toutes les annonces
  let apiRequest = await fetch("http://localhost:3000/annonce/all");
  let annonces = await apiRequest.json();
  //pour chaque annonces
  annonces.annonces.forEach(async (annonce, i) => {
    //on stocke l'info de l'annonce
    let infoAnnonce = {
      ...annonce,
      // on rajoute/remplace l'id par le numéro d'annonce
      id: `annonce${i}`,
    };
    //Création de l'élement card pour afficher les annonces
    let card = document.createElement("div");
    //ajout de class
    card.classList.add("annonce", `annonce${i}`);
    //Création du contenu des card
    card.innerHTML += `
        <h2>${annonce.titre}</h2>
          <img src="${annonce.image}" />
        <div class="annonce-p">
           <p>${annonce.description}</p>
        </div>`;
    //Implémentation des card dans le main
    main.appendChild(card);
    // Création d'une requete patch afin de mettre à jour l'id des annonces
    let request = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(infoAnnonce),
    };
    // Communication afin de mettre à jour les annonces
    let patchAnnonce = await fetch(
      "http://localhost:3000/annonce/update",
      request
    );
  });
  modalAnnonce();
}

function modalAnnonce() {
  //Création d'un tableau contenant toutes les annonces affiché
  let annonces = document.querySelectorAll(".annonce");
  //pour chaque annonce du tableau annonces
  annonces.forEach((element) => {
    //on leur ajoute un evenement click
    element.addEventListener("click", async () => {
      //si dans le local storage on à un id
      if (id) {
        //verification de si l'id utilisateur existe
        let apiRequest = await fetch(`http://localhost:3000/user/${id}`);
        let response = await apiRequest;
        //si elle existe
        if (response.status === 200) {
          //on compare l'id utilisateur à l'id annonce
          let compare = {
            idUser: id,
            idAnnonce: element.classList[1],
          };
          //création de la requete afin de comparer
          let requestCompareId = {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(compare),
          };
          let compareId = await fetch(
            "http://localhost:3000/annonce/compareUserId",
            requestCompareId
          );
          let responseCompareId = await compareId;

          //création de la modal
          let modal = document.createElement("div");
          modal.classList.add("modal");
          let divModal = document.createElement("div");

          divModal.innerHTML = `
              <input type="text" value="${element.children[0].innerText}" class="titleModal">
              <img class="imageModal" src="${element.children[1].src}"/>
              <input type="text" value="${element.children[2].innerText}" class="descriptionModal">
              <div class=btnModal>
                <button class="btnChangeModal">Modifier l'annonce</button>
                <button class="btnDeleteModal">Supprimer l'annonce</button>
              </div>
            <button class="btnExitModal">X</button>`;
          //ajout de la classe annonce + le chiffre de l'annonce
          divModal.classList.add(`${element.classList[1]}`);
          //ajout de la modal
          modal.appendChild(divModal);
          body.appendChild(modal);
          let titleModal = document.querySelector(".titleModal");
          let imageModal = document.querySelector(".imageModal");
          let descriptionModal = document.querySelector(".descriptionModal");
          let btnExitModal = document.querySelector(".btnExitModal");
          let btnDeleteModal = document.querySelector(".btnDeleteModal");
          let btnChangeModal = document.querySelector(".btnChangeModal");
          let overlay = document.createElement("div");
          overlay.classList.add("overlay");

          body.appendChild(overlay);
          body.classList.add("overflow");

          let elementsModal = document.querySelector(
            `.modal .${element.classList[1]}`
          );

          elementsModal.classList.add("annonceModal");
          elementsModal.classList.remove(`${element.classList[0]}`);
          // si on clique sur le bouton modifier de la modal
          btnChangeModal.addEventListener("click", async () => {
            let annonce = element.classList[1];
            let foundAnnonce = await fetch(
              `http://localhost:3000/annonce/${annonce}`
            );

            let info = await foundAnnonce.json();
            let title = titleModal.value;
            let description = descriptionModal.value;
            //création de la requete pour modifier
            let modifInfo = {
              ...info,
              titre: title,
              description: description,
            };

            let request = {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: JSON.stringify(modifInfo),
            };
            //envoie de la requete
            let modifAnnonce = await fetch(
              "http://localhost:3000/annonce/update",
              request
            );
            let response = await modifAnnonce;
            //si requete réussi
            if (response.status === 200) {
              deleteModal();
              element.children[0].innerText = title;
              element.children[2].innerHTML = `<p>${description}</p>`;
            }
          });
          // si on clique sur le bouton pour fermer ou en dehors de la modal
          //on ferme la modal
          btnExitModal.addEventListener("click", deleteModal);
          overlay.addEventListener("click", deleteModal);
          //Si on clique sur le bouton supprimer de la modal
          btnDeleteModal.addEventListener("click", async () => {
            let infoAnnonce = {
              id: element.classList[1],
              idUser: id,
            };
            let request = {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: JSON.stringify(infoAnnonce),
            };
            let deleteAnnonce = await fetch(
              `http://localhost:3000/annonce/delete/`,
              request
            );
            let response = await deleteAnnonce;
            //si la requete est réussie suppression de la modal
            //ainsi que de l'annonce
            if (response.status === 200) {
              deleteModal();
              element.remove();
            } else {
              console.log("vous n'êtes pas l'auteur de l'annonce");
            }
          });
          //si la requete ligne 77
          //comparaison entre l'iduser et l'id annonce renvoie une erreur
          if (responseCompareId.status !== 200) {
            //on enleve les bouton pour modifier ou supprimer l'annonce
            btnDeleteModal.style.display = "none";
            btnChangeModal.style.display = "none";
          } else {
            console.log("vous êtes l'auteur de l'annonce");
          }
        }
      } else {
        //si vous n'avez pas d'iduser, on considère que vous n'êtes pas connecter
        window.location.href = "../login/login.html";
      }
    });
  });
}
function deleteModal() {
  console.log("modal delete");
  document.querySelector(".modal").remove();
  document.querySelector(".overlay").remove();
  body.classList.remove("overflow");
}
// function qui permet de se déconnecter et qui enleve les boutons login et register
function disconnect() {
  register.style.display = "none";
  login.style.display = "none";
  disconnectButton.style.display = "inline";
}
async function isConnected(id) {
  //vérification de si il à un id
  if (id) {
    let apiRequest = await fetch(`http://localhost:3000/user/${id}`);
    let response = await apiRequest;
    //si l'id correspond à un utilisateur
    if (response.status === 200) {
      //affichage du bouton se deconnecter et suppréssion des boutons login/register
      disconnect();
    } else {
      //si il à un iduser qui ne correspond pas, on supprime l'id du local storage
      localStorage.removeItem("_id");
    }
  }
}
async function isAdmin(id) {
  //vérification de si l'idUser et admin
  let idBody = {
    id: id,
  };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(idBody),
  };
  let isAdminCall = await fetch("http://localhost:3000/user/isAdmin", request);
  let result = await isAdminCall;
  console.log(result);
  if (result.status !== 200) {
    let btnAdmin = document.querySelector(".btn-admin");
    btnAdmin.remove();
  }
}
disconnectButton.addEventListener("click", () => {
  localStorage.removeItem("_id");
  id = null;
  register.style.display = "inline";
  login.style.display = "inline";
  disconnectButton.style.display = "none";
});
getAnnonces();
isConnected(id);
isAdmin(id);
