class Book {
  constructor(bookJSON) {
    this.comments = []
    this.id = bookJSON.id
    this.title = bookJSON.title
    this.author = bookJSON.author
    this.loadComments(bookJSON.comments)
  }

  removeComment(commentId) {
    this.comments = this.comments.filter(comment => comment.id !== commentId)
  }

  addComment(newComment) {
    this.comments = this.comments.concat(newComment)
  }

  loadComments(comments) {
    comments.forEach (commentJSON => {
      this.comments.push(new Comment(commentJSON, this.id))
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
    <form id='new-comment-form' data-id=${this.id}>
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
