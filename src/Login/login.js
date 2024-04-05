console.log("hello");
async function handleLogin() {
	event.preventDefault();
	let email = document.querySelector(".email").value;
	let password = document.querySelector(".password").value;

	let newUser = {
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
			"http://localhost:3000/user/login",
			request
		);
		let response = await apiRequest;
		console.log(response);
		if (response.status === 200) {
			window.location.href = "../Index/index.html";
			console.log("test changement de page");
		} else {
			console.log("test");
		}
	} catch (e) {
		console.log(e);
	}
}
