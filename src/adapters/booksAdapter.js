class BooksAdapter {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/v1/books'
  }

  getBooks() {
    return fetch(this.baseUrl).then(res => res.json())
  }

  createBook(title, author) {
    const book = {
      title: title,
      author: author
    }

    const bookCreateParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ book })
    }
    return fetch(this.baseUrl, bookCreateParams).then(res => res.json())
  }

  updateBook(title, id) {
    const book = {
      title: title
    }

    const bookUpdateParams = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ book })
    }
    return fetch(`${this.baseUrl}/${id}`, bookUpdateParams)
    .then(res => res.json())
  }

  deleteBook(bookId) {
    const bookDeleteParams = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.baseUrl}/${bookId}`, bookDeleteParams)
    .then(res => res.json())
  }

  createComment (content, id) {
    const commentCreateParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    }
    return fetch(`${this.baseUrl}/${id}/comments`, commentCreateParams)
    .then(res => res.json())
  }
}
