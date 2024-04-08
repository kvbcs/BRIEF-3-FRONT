async function handleAnnonce() {
  event.preventDefault();
  let title = document.querySelector(".title").value;
  let image = document.querySelector("#image").src;
  let description = document.querySelector(".description").value;
  console.log(image);
  let newAnnonce = {
    titre: title,
    image: image,
    description: description,
    id: localStorage.getItem("_id"),
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newAnnonce),
  };

  try {
    let apiRequest = await fetch(
      "http://localhost:3000/annonce/create",
      request
    );
    let response = await apiRequest;
    if (response.status === 201) {
      window.location.href = "../Index/index.html";
    } else {
      window.location.href = "../Login/login.html";
    }
  } catch (e) {
    console.log(e);
  }
}
