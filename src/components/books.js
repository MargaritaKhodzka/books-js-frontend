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
    this.bookShowNode = document.getElementById('book-show')
    this.title = document.querySelector('title')

    this.booksForm.addEventListener('submit', this.handleAddBook.bind(this))
    this.booksNode.addEventListener('click', this.handleBookClick.bind(this))
    this.title.addEventListener('blur', this.updateBook.bind(this), true)
  }

  fetchAndLoadBooks() {
    this.adapter
      .getBooks()
      .then(booksJSON => booksJSON.forEach(book => this.books.push(new Book(book))))
      .then(this.render.bind(this))
      .catch((error) => console.log(error))
  }

  updateBook() {
    if (event.target.className.includes('book-element')) {
      const { target } = event
      target.contentEditable = false
      target.classList.remove('editable')
      const title = event.target.innerHTML
      const bookId = target.dataset.bookid
      this.adapter.updateBook(title, bookId)
        .then(updatedBook => {this.books = this.books.map(
          b => (b.id === updatedBook.id ? new Book(updatedBook) : b)
        )
        this.render()
      })
    }
  }

  toggleEditBook() {
    const { parentElement: target } = event.target
    if (target.className == 'book-element') {
      target.classList.add('editable')
      const bookId = target.dataset.bookid
      const book = this.books.find(b => b.id == bookId)
      target.contentEditable = true
      target.innerHTML = book.title
      target.focus()
    }
  }

  handleAddBook() {
    event.preventDefault()
    const title = this.bookInput.value
    this.adapter
      .createBook(title)
      .then((bookJSON) => this.books.push(new Book(bookJSON)))
      .then(this.render.bind(this))
      .then(() => (this.bookInput.value = ''))
  }

  handleBookClick() {
    if (
      event.target.dataset.action === 'delete-book' &&
      event.target.parentElement.classList.contains('book-element')
    ) {
      const bookId = event.target.parentElement.dataset.bookid
      this.adapter.deleteBook(bookId).then(resp => this.removeDeletedBook(resp))
    } else if (
      event.target.dataset.action === 'edit-book'
    ) {
      this.toggleEditBook()
    } else if (
      event.target.className === 'show-link'
    ) {
      const bookId = event.target.parentElement.dataset.bookid
      const book = this.books.find(b => b.id === +bookId)
      this.bookShowNode.innerHTML = book.renderShow()
    }
  }

  // handleDeleteBook() {
  //   if (event.target.dataset.action === 'delete-book' && event.target.parentElement.classList.contains("book-element")) {
  //     const bookId = event.target.parentElement.dataset.bookid
  //     this.adapter.deleteBook(bookId)
  //     .then(resp => this.removeDeletedBook(resp))
  //   }
  // }

  removeDeletedBook(deleteResponse) {
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
