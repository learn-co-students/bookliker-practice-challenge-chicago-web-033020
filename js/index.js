document.addEventListener("DOMContentLoaded", function() {
  getBooks()

  const list = document.querySelector("#list")
  const showPanel = document.querySelector('#show-panel')
  let currentBook

  list.addEventListener("click", getBookDetails)
  showPanel.addEventListener("click", readBook)

  function readBook(event){
    if (event.target.tagName === "BUTTON"){
      if(currentBook.users.find(user => user.id === 1)){
        alert("You've already read this book, dozo!")
      } else {
        currentBook.users.push({id: 1, username: "pouros"})

        const formData = {users: currentBook.users}
        const reqObj = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }

        fetch(`http:localhost:3000/books/${currentBook.id}`, reqObj)
        .then(resp => resp.json())
        .then(json => renderBookDetails(json))
      }
    }
  }

  function getBookDetails(event){
    if (event.target.tagName === "LI"){
      const bookId = parseInt(event.target.id)

      fetch(`http://localhost:3000/books/${bookId}`)
      .then(resp => resp.json())
      .then(json => renderBookDetails(json))
    }
  }

  function renderBookDetails(book){
    currentBook = book
    showPanel.innerHTML = `<h1>${book.title}</h1><img src=${book.img_url}></img><p>${book.description}</p><ul>${populateLikes(book.users)}</ul><button>Read Book</button>`
  }

  function populateLikes(users){
    return users.map(user => `<li>${user.username}</li>`).join('')
  }

  function getBooks(){
    fetch(`http://localhost:3000/books`)
    .then(resp => resp.json())
    .then(json => renderBooks(json))
  }

  function renderBooks(books){
    list.innerHTML = books.map(book => renderBook(book)).join('')
  }

  function renderBook(book){
    return `<li id="${book.id}">${book.title}</li>`
  }
});
