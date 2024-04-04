async function handleRegister() {
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
		let response = await apiRequest;
		console.log(response);
		if (response.status === 201) {
			window.location.href = "index.html";
			console.log("test changement de page");
		} else {
			console.log("test");
		}
	} catch (e) {
		console.log(e);
	}
}
