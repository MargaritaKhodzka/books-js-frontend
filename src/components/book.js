class Book {
  constructor(bookJSON) {
    this.comments = []
    this.id = bookJSON.id
    this.title = bookJSON.title
    this.author = bookJSON.author
    this.loadComments(bookJSON.comments)
  }

  render() {
    return `<li data-bookid='${this.id}'
    data-props='${JSON.stringify(this)}'
    class='book-element'>
    <a class='show-link' href='#'>${this.title}</a>
    <button data-action='edit-book'><img id='edit' src='styles/media/edit.png' alt='edit book'/></button>
    <button data-action='delete-book'><img id='delete' src='styles/media/delete.png' alt='delete book'/></button></li>`
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

  commentsHTML() {
    return this.comments.map(comment => {
      return comment.render()
    }).join('')
  }

  loadComments(comments) {
    comments.forEach (commentJSON => {
      this.comments.push(new Comment(commentJSON, this.id))
    })
  }

  addComment(newComment) {
    this.comments = this.comments.concat(newComment)
  }

  updateComment(updatedComment, bookId) {
    this.comments = this.comments.map(comment => comment.id === updatedComment.id ? new Comment(updatedComment, bookId) : comment)
  }

  removeComment(commentId) {
    this.comments = this.comments.filter(comment => comment.id !== commentId)
  }
}
