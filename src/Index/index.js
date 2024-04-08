const body = document.querySelector("body");
const main = document.querySelector("main");
const disconnectButton = document.querySelector(".disconnect");
const register = document.querySelector(".btn-register");
const login = document.querySelector(".btn-login");
let id = localStorage.getItem("_id");
let annonces;
async function getAnnonces() {
  let apiRequest = await fetch("http://localhost:3000/annonce/all");
  annonces = await apiRequest.json();
  annonces.annonces.forEach(async (annonce, i) => {
    let infoAnnonce = {
      ...annonce,
      id: `annonce${i}`,
    };
    let card = document.createElement("div");
    card.classList.add("annonce", `annonce${i}`);
    card.innerHTML += `
        <h2>${annonce.titre}</h2>
        <img src="${annonce.image}" />
        <p>${annonce.description}</p>`;
    main.appendChild(card);
    let request = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(infoAnnonce),
    };
    let patchAnnonce = await fetch(
      "http://localhost:3000/annonce/update",
      request
    );
    let response = await patchAnnonce;
    console.log(response);
  });
  deleteButton();
}

function deleteButton() {
  let annonce = document.querySelectorAll(".annonce");
  annonce.forEach((element) => {
    element.addEventListener("click", () => {
      let modal = document.createElement("div");
      modal.classList.add("modal");
      let divModal = document.createElement("div");
      divModal.innerHTML = element.innerHTML;
      divModal.classList.add(`${element.classList[1]}`);
      modal.appendChild(divModal);

      let overlay = document.createElement("div");
      overlay.classList.add("overlay");

      body.appendChild(modal);
      body.appendChild(overlay);
      body.classList.add("overflow");

      let elementsModal = document.querySelector(
        `.modal .${element.classList[1]}`
      );
      console.log(elementsModal);
      elementsModal.classList.add("annonceModal");
      elementsModal.classList.remove(`${element.classList[0]}`);

      document
        .querySelector(`.modal .${element.classList[1]} h2`)
        .classList.add("titleModal");
      document
        .querySelector(`.modal .${element.classList[1]} img`)
        .classList.add("imageModal");
      document
        .querySelector(`.modal .${element.classList[1]} p`)
        .classList.add("descriptionModal");

      let btnExit = document.createElement("button");
      btnExit.classList.add("btnExitModal");
      btnExit.innerText = "X";
      elementsModal.appendChild(btnExit);

      let btnChange = document.createElement("button");
      btnChange.classList.add("btnChangeModal");
      btnChange.innerText = "Modifier l'annonce";
      elementsModal.appendChild(btnChange);

      let btnDelete = document.createElement("button");
      btnDelete.classList.add("btnDeleteModal");
      btnDelete.innerText = "Supprimer l'annonce";
      elementsModal.appendChild(btnDelete);
      btnExit.addEventListener("click", deleteModal);
      overlay.addEventListener("click", deleteModal);

      btnDelete.addEventListener("click", async () => {
        let id = element.classList[1];
        let request = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        };
        console.log(request);
        let deleteAnnonce = await fetch(
          `http://localhost:3000/annonce/delete/${id}`,
          request
        );
        let response = await deleteAnnonce;
        console.log(response);
        if (response.status === 200) {
          element.remove();
        } else {
          console.log("vous n'êtes pas l'auteur de l'annonce");
        }
      });
    });
  });
}
function deleteModal() {
  console.log("modal delete");
  document.querySelector(".modal").remove();
  document.querySelector(".overlay").remove();
  body.classList.remove("overflow");
}
function disconnect() {
  register.style.display = "none";
  login.style.display = "none";
  disconnectButton.style.display = "inline";
}
async function isConnected(id) {
  if (id) {
    let apiRequest = await fetch(`http://localhost:3000/user/${id}`);
    let response = await apiRequest;
    if (response.status === 200) {
      disconnect();
    } else {
      localStorage.removeItem("_id");
    }
  }
}
disconnectButton.addEventListener("click", () => {
  localStorage.removeItem("_id");
  register.style.display = "inline";
  login.style.display = "inline";
  disconnectButton.style.display = "none";
});
getAnnonces();
isConnected(id);

//comparer le _id avec l'object id dans la base de donnée
//si il n'y à aucun utilisateur avec cette object id
//supprimer le local storage
//rafficher les boutons login/register
// disconnect();
