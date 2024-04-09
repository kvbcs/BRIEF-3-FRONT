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
  console.log(annonces);
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
        <div class="annonce-p">
           <p>${annonce.description}</p>
        </div>`;
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
  modalAnnonce();
}

function modalAnnonce() {
  let annonce = document.querySelectorAll(".annonce");
  annonce.forEach((element) => {
    element.addEventListener("click", async () => {
      //
      if (id) {
        let apiRequest = await fetch(`http://localhost:3000/user/${id}`);
        let response = await apiRequest;

        if (response.status === 200) {
          // verifier si l'id  et l'idUser sont identique
          let compare = {
            idUser: id,
            idAnnonce: element.classList[1],
          };
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
          console.log("vous êtes l'auteur");
          let modal = document.createElement("div");
          modal.classList.add("modal");
          let divModal = document.createElement("div");
          // divModal.innerHTML = element.innerHTML;

          divModal.innerHTML = `
              <input type="text" value="${element.children[0].innerText}" class="titleModal">
              <img class="imageModal" src="${element.children[1].src}"/>
              <input type="text" value="${element.children[2].innerText}" class="descriptionModal">
              <div class=btnModal>
                <button class="btnChangeModal">Modifier l'annonce</button>
                <button class="btnDeleteModal">Supprimer l'annonce</button>
              </div>
            <button class="btnExitModal">X</button>`;

          divModal.classList.add(`${element.classList[1]}`);
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

          btnChangeModal.addEventListener("click", async () => {
            let annonce = element.classList[1];
            let foundAnnonce = await fetch(
              `http://localhost:3000/annonce/${annonce}`
            );

            let info = await foundAnnonce.json();
            let title = titleModal.value;
            let description = descriptionModal.value;

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

            let modifAnnonce = await fetch(
              "http://localhost:3000/annonce/update",
              request
            );
            let response = await modifAnnonce;
            if (response.status === 200) {
              deleteModal();
              element.children[0].innerText = title;
              element.children[2].innerHTML = `<p>${description}</p>`;
            }
          });

          btnExitModal.addEventListener("click", deleteModal);
          overlay.addEventListener("click", deleteModal);

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
            console.log(request);
            let deleteAnnonce = await fetch(
              `http://localhost:3000/annonce/delete/`,
              request
            );
            let response = await deleteAnnonce;
            console.log(response);
            if (response.status === 200) {
              deleteModal();
              element.remove();
            } else {
              console.log("vous n'êtes pas l'auteur de l'annonce");
            }
          });
          if (responseCompareId.status !== 200) {
            btnDeleteModal.style.display = "none";
            btnChangeModal.style.display = "none";
          } else {
            console.log("vous êtes l'auteur de l'annonce");
          }
        }
      } else {
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
  id = null;
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
