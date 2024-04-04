console.log("hello");

async function handleRegister(event) {
	event.preventDefault();

	let firstName = document.querySelector(".firstName").value;
	let lastName = document.querySelector(".lastName").value;
	let email = document.querySelector(".email").value;
	let password = document.querySelector(".password").value;

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
	try {
		let apiRequest = await fetch(
			"http://localhost:3000/user/register",
			request
		);
		let response = await apiRequest.json();
		console.log(response);
		if (response.status === 200) {
			window.location.href = "index.html";
		}
	} catch (e) {
		console.log(e);
	}
}

class Annonce {
	constructor(id, titre, image, description, iduser) {
		this.id = id;
		this.titre = titre;
		this.image = image;
		this.description = description;
		this.iduser = iduser;
	}
}
class User {
	constructor(id, firstname, lastname, email, password) {
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
	}
}
