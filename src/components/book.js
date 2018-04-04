class Book {
  constructor(bookJSON) {
    this.init()
    this.title = bookJSON.title
    this.id = bookJSON.id
    this.author = bookJSON.author
    this.comments = []
    this.loadComments(bookJSON.comments)
  }

  init() {
    this.bookShowNode = document.getElementById('book-show')
    if (this.bookShowNode.addEventListener) {
      this.bookShowNode.addEventListener('click', handleAddComment, false)
    } else if (this.bookShowNode.attachEvent) {
      this.bookShowNode.attachEvent('onclick', handleAddComment)
    }
  }

  handleAddComment (e) {
    e.preventDefault()
    const content = e.target.children[0].value
    console.log(content)
  }

  loadComments () {
    comments.forEach (commentJSON => {
      this.comments.push(new Comment(commentJSON))
    })
  }

  commentsHTML() {
    return this.comments.map(comment => {
      return comment.render()
    }).join('')
  }

  renderShow() {
    return `<h3>${this.title} by ${this.author}</h3>
    <h5>Comments:</h5>
    <ul>${this.commentsHTML()}</ul>
    <form id='new-comment-form'>
      <input type='text' name='comment-body' id='new-comment-body'>
      <input type='submit' value='Submit comment'>
    </form>`
  }

  render() {
    return `<li data-bookid='${this.id}' data-props='${JSON.stringify(this)}'
    class='book-element'>
    <a class="show-link" href='#'>${this.title}</a>
    <button data-action='edit-book'>Edit</button>
    <button data-action='delete-book'>Delete</button></li>`
  }
}
