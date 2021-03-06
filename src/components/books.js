class Books {
  constructor() {
    this.books = []
    this.initBindingsAndEventListeners()
    this.adapter = new BooksAdapter()
    this.fetchAndLoadBooks()
  }

  initBindingsAndEventListeners() {
    this.booksForm = document.getElementById('new-book-form')
    this.bookTitle = document.getElementById('new-book-title')
    this.bookAuthor = document.getElementById('new-book-author')
    this.booksNode = document.getElementById('books-container')
    this.bookShowNode = document.getElementById('book-show')
    this.body = document.querySelector('body')

    this.booksForm.addEventListener('submit', this.handleAddBook.bind(this))
    this.booksNode.addEventListener('click', this.handleBookClick.bind(this))
    this.body.addEventListener('blur', this.updateBook.bind(this), true)

    this.bookShowNode.addEventListener('submit', this.handleAddComment.bind(this))
    this.bookShowNode.addEventListener('click', this.handleCommentClick.bind(this))
    this.bookShowNode.addEventListener('blur', this.updateComment.bind(this), true)
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
    const title = this.bookTitle.value
    const author = this.bookAuthor.value
    this.adapter.createBook(title, author)
      .then((bookJSON) => this.books.push(new Book(bookJSON)))
      .then(this.render.bind(this))
      .then(() => (this.bookTitle.value = '') )
      .then(() => (this.bookAuthor.value = '') )
  }

  updateBook() {
    if (event.target.className.includes('book-element')) {
      const { target } = event
      target.contentEditable = false
      target.classList.remove('editable')
      const title = event.target.innerHTML
      const bookId = target.dataset.bookid

      this.adapter.updateBook(title, bookId)
      .then(updatedBook => {
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
    if (target.className === 'book-element') {
      target.classList.add('editable')
      const bookId = target.dataset.bookid
      const book = this.books.find(book => book.id == bookId)
      target.contentEditable = true
      target.innerHTML = book.title
      target.focus()
    }
  }

  handleBookClick() {
    if (event.target.className === 'show-link') {
      const bookId = event.target.parentElement.dataset.bookid
      const book = this.findById(bookId)
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

  handleAddComment(event) {
    event.preventDefault()
    const content = event.target.children[0].value
    const bookId = event.target.dataset.id
    const book = this.findById(bookId)

    this.adapter.createComment(content, bookId)
      .then(comment => {
        book.addComment(new Comment(comment, bookId))
        this.bookShowNode.innerHTML = book.renderShow()
      })
  }

  toggleEditComment() {
    const { parentElement: target } = event.target
    target.classList.add('editable')
    const bookId = target.dataset.bookid
    const commentId = target.dataset.commentid
    const book = this.books.find(book => book.id == bookId)
    const comment = book.comments.find(comment => comment.id === +commentId)
    target.contentEditable = true
    target.innerHTML = comment.content
    target.focus()
  }

  updateComment() {
    if (event.target.className === 'editable') {
      const { target } = event
      const bookId = target.dataset.bookid
      const commentId = target.dataset.commentid
      const book = this.findById(bookId)
      target.contentEditable = false
      const content = target.innerHTML
      target.classList.remove('editable')

      this.adapter.updateComment(bookId, commentId, content)
      .then(updatedComment => {
        book.updateComment(updatedComment, bookId)
        this.bookShowNode.innerHTML = book.renderShow()
      })
    }
  }

  handleCommentClick() {
    if (event.target.dataset.action === 'edit-comment') {
      this.toggleEditComment()
    } else if (event.target.dataset.action === 'delete-comment') {
      const { parentElement: target } = event.target
      const bookId = target.dataset.bookid
      const commentId = target.dataset.commentid
      const book = this.findById(bookId)
      this.adapter.deleteComment(bookId, commentId)
      .then(data => {
        book.removeComment(data.commentId)
        this.bookShowNode.innerHTML = book.renderShow()
      })
    }
  }


}
