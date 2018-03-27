class Books {
  constructor() {
    this.books = []
    this.initBindingsAndEventListeners()
    this.adapter = new BooksAdapter()
    this.fetchAndLoadBooks()
  }

  initBindingsAndEventListeners() {
    this.booksForm = document.getElementById('new-book-form')
    this.bookInput = document.getElementById('new-book-title')
    this.booksNode = document.getElementById('books-container')

    this.booksForm.addEventListener('submit', this.handleAddBook.bind(this))
    this.booksNode.addEventListener('click', this.handleDeleteBook.bind(this))
  }

  fetchAndLoadBooks() {
    this.adapter.getBooks()
    .then(booksJSON => booksJSON.forEach(book => this.books.push(new Book(book))))
    .then(this.render.bind(this))
    .catch((error) => console.log(error))
  }

  handleAddBook() {
    event.preventDefault()
    const title = this.bookInput.value
    this.adapter.createBook(title)
    .then((bookJSON) => this.books.push(new Book(bookJSON)))
    .then(this.render.bind(this))
    .then(() => this.bookInput.value = '')
  }

  handleDeleteBook() {
    if (event.target.dataset.action === 'delete-book' && event.target.parentElement.classList.contains("book-element")) {
      const bookId = event.target.parentElement.dataset.bookid
      this.adapter.deleteBook(bookId)
      .then(resp => this.removeDeleteBook(resp))
    }
  }

  removeDeleteBook(deleteResponse) {
    this.books = this.books.filter(book => book.id !== deleteResponse.bookId)
    this.render()
  }

  booksHTML() {
    return this.books.map(book => book.render()).join('')
  }

  render() {
    this.booksNode.innerHTML = `<ul>${this.booksHTML()}</ul>`
  }
}
