//document.addEventListener("DOMContentLoaded", function() {});
const list = document.getElementById('list')
const show = document.getElementById('show-panel')
let allBooks = []
const me = {"id":1, "username":"pouros"}

function main(){
  getBooks()

  list.addEventListener("click", handleClick)
}

function getBooks(){
  fetch('http://localhost:3000/books')
  .then(resp => resp.json())
  .then(books => {
    allBooks = books
    renderList(books)});

}

function renderList(books){
  let ul = ""
  books.forEach(book => {
    let li = `<li> ${book.title} <img src=${book.img_url} class="book-item" data-book-id=${book.id}> </img> <button data-id=${book.id} class='like-btn'>like</li>`
    ul += li
  })
  
  list.innerHTML = ul
}

function handleClick(event){
  console.log(event)
  if (event.target.className === "book-item"){
    displayBook(event)
  } else if (event.target.className === "like-btn"){
    updateLike(event)
  }
}

function displayBook(event){
  
  const idx = parseInt(event.target.dataset.bookId) - 1 
  let bookitem = `<p> ${allBooks[idx].description} </p> <p> likes by: </p>`
  let usernames= ""
  allBooks[idx].users.forEach(user => {
    
    let userp = `<p> ${user.username} </p>`
    usernames += userp
  })
  show.innerHTML = bookitem + usernames
}

function updateLike(event){
  
  const idx = parseInt(event.target.dataset.id) - 1
  curUsers = allBooks[idx].users
  curUsers.push(me) 

  const formData = {
    users: curUsers
  }

  const reqObj = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  }
  fetch(`http://localhost:3000/books/${event.target.dataset.id}`, reqObj)
  .then(resp => resp.json())
  .then(book => updateUserLike(book))
}

function updateUserLike(book){
  show.innerHTML += `<p> ${book.users[book.users.length - 1].username} </p>`

}
main()