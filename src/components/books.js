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
    this.body = document.querySelector('body')

    this.booksForm.addEventListener('submit', this.handleAddBook.bind(this))
    this.body.addEventListener('blur', this.updateBook.bind(this), true)
    this.booksNode.addEventListener('click', this.handleBookClick.bind(this))
    this.bookShowNode.addEventListener('submit', this.handleAddComment.bind(this))
  }

  fetchAndLoadBooks() {
    this.adapter.getBooks()
      .then(booksJSON => booksJSON.forEach(book => this.books.push(new Book(book))))
      .then(this.render.bind(this))
      .catch((error) => console.log(error))
  }

  findById(id) {
    return this.books.find(book => book.id === +id)
  }

  handleAddBook() {
    event.preventDefault()
    const title = this.bookInput.value
    this.adapter.createBook(title)
      .then((bookJSON) => this.books.push(new Book(bookJSON)))
      .then(this.render.bind(this))
      .then(() => (this.bookInput.value = ''))
  }

  updateBook() {
    if (event.target.className.includes('book-element')) {
      const { target } = event
      target.contentEditable = false
      target.classList.remove('editable')
      const title = event.target.innerHTML
      const bookId = target.dataset.bookid
      this.adapter.updateBook(title, bookId).then(updatedBook => {
        const newBook = new Book(updatedBook)
        this.books = this.books.map(
          book => (book.id === updatedBook.id ? newBook : book)
        )
        this.render()
        this.bookShowNode.innerHTML = newBook.renderShow()
      })
    }
  }

  toggleEditBook() {
    const { parentElement: target } = event.target
    if (target.className == 'book-element') {
      target.classList.add('editable')
      const bookId = target.dataset.bookid
      const book = this.books.find(book => book.id === bookId)
      target.contentEditable = true
      target.innerHTML = book.title
      target.focus()
    }
  }

  handleBookClick() {
    if (event.target.className === 'show-link') {
      const bookId = event.target.parentElement.dataset.bookid
      const book = this.books.find(book => book.id === +bookId)
      this.bookShowNode.innerHTML = book.renderShow()
    } else if (event.target.dataset.action === 'edit-book') {
      this.toggleEditBook()
    } else if (
      event.target.dataset.action === 'delete-book' &&
      event.target.parentElement.classList.contains('book-element')
    ) {
      const bookId = event.target.parentElement.dataset.bookid
      this.adapter.deleteBook(bookId).then(resp => this.removeDeletedBook(resp))
    }
  }

  removeDeletedBook(deleteResponse) {
    this.books = this.books.filter(book => book.id !== deleteResponse.bookId)
    this.render()
    this.bookShowNode.innerHTML = ''
  }

  booksHTML() {
    return this.books.map(book => book.render()).join('')
  }

  render() {
    this.booksNode.innerHTML = `<ul>${this.booksHTML()}</ul>`
  }

  handleAddComment (event) {
    event.preventDefault()
    const content = event.target.children[0].value
    const bookId = event.target.dataset.id
    const book = this.books.find(b => b.id === +bookId)
    this.adapter.createComment(content, bookId)
    .then(c => {
      book.addComment(new Comment(c))
      this.bookShowNode.innerHTML = book.renderShow()
    })
  }
}
