let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const addNewToy = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  addNewToy.addEventListener("submit", (e) => {
    e.preventDefault();
    const toyName = addNewToy.querySelector("input[name='name']");
    const toyImg = addNewToy.querySelector("input[name='image']");
    const toyData = {
      name: toyName.value,
      image: toyImg.value,
      likes: 0
    };
  
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toyData)
    })
      .then(response => response.json())
      .then(newToy => {
        const card = createToyCard(newToy);
        toyCollection.appendChild(card);
      });
    toyName.value = "";
    toyImg.value = "";
  });
// 45 - 51: Adds each existing toy to the toy collection
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    });

  function createToyCard(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const name = document.createElement("h2");
    name.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");

    const likes = document.createElement("p");
    likes.textContent = toy.likes + " likes";

    const btn = document.createElement("button");
    btn.textContent = "Like";
    btn.addEventListener("click", () => {
      increaseLikes(toy.id, likes)
    });

    card.appendChild(name);
    card.appendChild(img);
    card.appendChild(likes);
    card.appendChild(btn);
    return card;
  }
});

//83 - 99: Increases the number of likes of the toy (with the event listener in lines 43/44)
function increaseLikes(toyID, likesElement) {
  const newLikes = parseInt(likesElement.textContent) + 1;
  fetch("http://localhost:3000/toys/" + toyID, {
    method:"PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
 .then(response => response.json())
 .then(newToy => {
    likesElement.textContent = newToy.likes + " likes";
  });
}