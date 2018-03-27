class BooksAdapter {
  constructor() {
    this.baseUrl = "http://localhost:3000/api/v1/books"
  }

  getBooks() {
    return fetch(this.baseUrl).then(res => res.json())
  }

  createBook(title) {
    const bookCreateParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      title: JSON.stringify({title})
    }
    return fetch(this.baseUrl, bookCreateParams).then(res => res.json())
  }

  deleteBook(bookId) {
    const bookDeleteParams = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }
    return fetch(`${this.baseUrl}/${bookId}`, bookDeleteParams).then(res => res.json())
  }
}
