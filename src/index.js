let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys()
});

function getToys() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(data => createCards(data))
}

function createCards(data) {
  data.forEach(d => newToy(d))
}

function newToy(d) {
  const card = document.createElement('div')
    card.className = 'card'
    card.id = `card-${d.id}`
    document.getElementById('toy-collection').appendChild(card)
    const cardName = document.createElement('h2')
    cardName.innerText = d.name
    card.appendChild(cardName)
    const pic = document.createElement('img')
    pic.className = 'toy-avatar'
    pic.src = d.image
    card.appendChild(pic)
    const likes = document.createElement('p')
    likes.innerText = `${d.likes} likes`
    card.appendChild(likes)
    const likeButton = document.createElement('button')
    likeButton.className = "like-btn"
    likeButton.innerText = "Like"
    likeButton.addEventListener('click', function(){
      addLike(d)
    });
    card.appendChild(likeButton)
}

document.querySelector(".container").children[0].addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector(".container").style.display = "none";
  let newToyName = document.querySelector("body > div.container > form > input:nth-child(2)").value
  let newToyPic = document.querySelector("body > div.container > form > input:nth-child(4)").value
  const submitURL = `http://localhost:3000/toys`
  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: newToyName,
      image: newToyPic,
      likes: 0
    })
  };
  return fetch(submitURL, configObj)
  .then(response => response.json())
  .then(data => newToy(data))
})

function addLike(toy) {
  console.log(toy)
  let currentToy = document.getElementById(`card-${toy.id}`)
  let toyLikes = currentToy.children[2]
  // toyLikes.innerText = `${toy.likes +1} likes`
  const submitURL = `http://localhost:3000/toys/${toy.id}`
  let configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: ++toy.likes
    })
  }
  return fetch(submitURL, configObj)
  .then(response => response.json())
  .then(toyLikes.innerText = `${toy.likes} likes`)
}