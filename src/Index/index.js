const main = document.querySelector("main");
let test;
async function getAnnonces() {
	let apiRequest = await fetch("http://localhost:3000/annonce/all");
	let annonces = await apiRequest.json();
	test = annonces;
	annonces.annonces.forEach((annonce, i) => {
		console.log(annonce);
		let card = document.createElement("div");
		card.classList.add("annonce", `annonce${i}`);
		card.innerHTML += `
        <h2>${annonce.titre}</h2>
        <img src="${annonce.image}" />
        <p>${annonce.description}</p>`;
		main.appendChild(card);
	});
	deleteButton();
}
getAnnonces();
function deleteButton() {
	let annonce = document.querySelectorAll(".annonce");
	annonce.forEach((element) => {
		let deleteButton = document.createElement("button");
		element.appendChild(deleteButton);
		deleteButton.addEventListener("click", () => {
			element.remove();
		});
	});
}
