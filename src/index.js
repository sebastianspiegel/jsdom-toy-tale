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
  loadToys();
  createNewToy();
});



function loadToys(){
  fetch('http://localhost:3000/toys').then(resp => resp.json()).then(info => {
    for (const toy of info) {
      createCard(toy);
    };
  });
};



function createCard(toy){

  let card = document.createElement('div');
  card.className = 'card';
  card.id = toy.id;

  let elements = [];

  let cardName = document.createElement('h2');
  cardName.innerText = toy.name
  cardName.id = toy.id + '-name'
  elements.push(cardName);

  let cardImg = document.createElement('img');
  cardImg.src = toy.image;
  cardImg.className = 'toy-avatar';
  cardImg.id = toy.id + '-image'
  elements.push(cardImg);

  let likes = document.createElement('p');
  likes.innerHTML = `${toy.likes} Likes`;
  likes.id = toy.id + '-likes'
  elements.push(likes);

  let likeButton = document.createElement('button');
  likeButton.class = 'like-btn';
  likeButton.innerHTML = 'Like <3'
  likeButton.id = toy.id + '-like-button'
  likeButton.addEventListener('click', function(){
    likeToy(toy)
  });
  elements.push(likeButton);

  let editButton = document.createElement('button');
  editButton.class = 'like-btn';
  editButton.innerHTML = 'Edit';
  editButton.id = `edit-button-${toy.id}`;
  editButton.addEventListener('click', function(e){
    if (editButton.innerText === 'Edit') {
      editToy(e, toy);
    } else {
      saveToy(e, toy)
    }
    
  });
  elements.push(editButton);

  for (const element of elements){
    card.appendChild(element);
  };

  document.getElementById('toy-collection').appendChild(card);
};

function saveToy(eventObject, jsonData) {
  let input = eventObject.target.parentElement.querySelector('input');
  let newName = input.value 
  // debugger;
  let saveButton = eventObject.target;
  saveButton.innerText = `Edit`;
  let formData = {
    name: newName,
    image: jsonData.image,
    likes: jsonData.likes}
  patchRequest(formData, jsonData.id)
  .then(toyReturn => {
    input.outerHTML = toyReturn.name 
    // debugger
  })
}


function editToy(eventObject, jsonData){
  let toyName = eventObject.target.parentElement.querySelector('h2');
  toyName.innerHTML = `<input type="text" class="input-text" value="${jsonData.name}"></input>`;
  let editButton = eventObject.target;
  editButton.innerText = `Save`;
};


function likeToy(toy){
  // const submitUrl = `http://localhost:3000/toys/${toy.id}`

  let formData = {
    name: toy.name,
    image: toy.image,
    likes: ++toy.likes
  };

  // let configObj = {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Accept": "application/json"
  //   },

  //   body: JSON.stringify(formData)
  // };
  patchRequest(formData, toy.id).then(json => rerenderCardLikes(json));

  
};

function patchRequest(formData, toyId) {
  const submitUrl = `http://localhost:3000/toys/${toyId}`
  let configObj = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify(formData)
  };
  return fetch(submitUrl, configObj).then(resp => resp.json())
}



function rerenderCardLikes(json){
  let likes = document.getElementById(json.id + '-likes');
  likes.innerHTML = json.likes + ' Likes';
};



function createNewToy(){
  let form = document.querySelector("body > div.container > form")
  form.addEventListener('submit', function(e){
    e.preventDefault();
    let nameInput = document.querySelector("body > div.container > form > input:nth-child(2)").value;
    let imgInput = document.querySelector("body > div.container > form > input:nth-child(4)").value;

    postToy(nameInput, imgInput);
    form.reset();
  })
};



function postToy(nameInput, imageInput){
  const submitUrl = 'http://localhost:3000/toys'

  let formData = {
    name: nameInput,
    image: imageInput,
    likes: 0
  };

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify(formData)
  };

  return fetch(submitUrl, configObj).then(resp => resp.json()).then(json => {
    createCard(json)
  });
};