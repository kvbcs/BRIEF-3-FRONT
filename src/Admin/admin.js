let submit = document.querySelector(".submit");
let table = document.querySelector("table");
let users = document.querySelectorAll(".users");
let tr = document.querySelectorAll("tr");
let th = document.querySelectorAll("th");
let input = document.querySelector("input");
let select = document.querySelector(".select").innerHTML;

function search() {
  users = document.querySelectorAll(".users");
  console.log(users);
  users.forEach((element) => {
    element.style.display = "none";

    // console.log(element);
  });
  console.log(users);
  table.style.overflowY = "hidden";
  //créer un user avec appendchild et createelement
  let result = document.createElement("tr");
  result.classList.add("users");
  table.appendChild(result);
  //appendchild des th ou faire innerHTML
  let prenom = document.createElement("th");
  prenom.innerHTML = "jean";
  result.appendChild(prenom);
  let nom = document.createElement("th");
  nom.innerHTML = "machin";
  result.appendChild(nom);
  let email = document.createElement("th");
  email.innerHTML = "jean@machin.com";
  result.appendChild(email);
  let statut = document.createElement("th");
  statut.innerHTML = select;
  result.appendChild(statut);
}

//récuprer le back et console logger les users
async function getUsers() {
  let apiRequest = await fetch("http://localhost:3000/user/all");
  let users = await apiRequest.json();
  console.log(users);
  // console.log(users.response.email);
  // let test = users.response;
  // console.log(test);
  // test.forEach((element) => console.log(element.email));
  users.forEach((element) => {
    // console.log(element);
    let tr = document.createElement("tr");
    tr.classList.add("users");
    let prenom = document.createElement("th");
    prenom.innerText = element.firstName;
    tr.appendChild(prenom);
    let nom = document.createElement("th");
    nom.innerText = element.lastName;
    tr.appendChild(nom);
    let email = document.createElement("th");
    email.innerText = element.email;
    tr.appendChild(email);
    let statut = document.createElement("th");
    statut.innerHTML = select;
    statut.classList.add("select");
    tr.appendChild(statut);
    table.appendChild(tr);
  });
}
getUsers();

async function getUserByEmail() {
  let email = document.querySelector("input").value;
  let userEmail = {
    email: email,
  };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(userEmail),
  };
  let apiRequest = await fetch("http://localhost:3000/user/email", request);
  let users = await apiRequest.json();
  console.log(users);
}
