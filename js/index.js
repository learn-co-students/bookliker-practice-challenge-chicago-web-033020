const BOOKS_URL = "http://localhost:3000/books"
const USERS_URL = "http://localhost:3000/users"

function objCheck(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false
    }
    for (const key of Object.keys(a)) {
        if (a[key] !== b[key]) {
            return false
        }
    }
    return true
}

document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById('list')
    const showPanel = document.getElementById('show-panel')
    const userOb = {
        "id": 1,
        "username": "pouros"
      }

    fetch(BOOKS_URL)
    .then(resp => resp.json())
    .then(books => books.forEach(
        book => {
            bookList.innerHTML += `<h2 class='book-title' id=${book.id}>${book.title}</h2>`
        }
    ))

    bookList.addEventListener("click", (e) => {
        if (e.target.className === 'book-title') {
            const bookUrl = e.target

            fetch(`${BOOKS_URL}/${bookUrl.id}`)
            .then(resp => resp.json())
            .then(jsonBook => {
                showPanel['book-id'] = bookUrl.id
                showPanel.innerHTML = 
                `<h1>${jsonBook.title}</h1><img src=${jsonBook.img_url}><p>${jsonBook.description}</p><button class='like-btn'>Read Book</button>`
            })
        }
    })

    showPanel.addEventListener('click', (e) => {
        let users
        if (e.target.className === 'like-btn') {
            const myId = e.target.parentNode['book-id']
            
            fetch(`${BOOKS_URL}/${myId}`)
            .then(resp => resp.json())
            .then(json => {
                const users = json.users

                if (users.find(user => objCheck(user, userOb))) {
                    const obj = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            users: users.filter(user => !objCheck(user, userOb))
                        })
                    }
    
                    fetch(`${BOOKS_URL}/${myId}`, obj)
                    .then(resp => resp.json())
                    .then(json => {
                        e.target.innerHTML = "Read Book"
                        console.log("You've been removed from the list of likers.")
                    })
                }
                else {
                    const obj = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            users: [...users, userOb]
                        })
                    }
    
                    fetch(`${BOOKS_URL}/${myId}`, obj)
                    .then(resp => resp.json())
                    .then(json => {
                        e.target.innerHTML = "Unread Book"
                        console.log(json)
                        console.log("You've been added to the list of users!")
                    })
                }
            })
            
        }
    })

})