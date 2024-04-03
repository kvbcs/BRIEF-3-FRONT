console.log("hello");

let body = document.querySelector("body");
let header = document.querySelector("header");
let footer = document.querySelector("footer");

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
