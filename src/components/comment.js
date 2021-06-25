class Comment {
  constructor (commentJSON, bookId) {
    this.content = commentJSON.content
    this.id = commentJSON.id
    this.bookId = bookId
  }

  render () {
    return `<li data-commentid='${this.id}' data-bookid='${this.bookId}'>
    ${this.content}
    <input data-action='edit-comment' type='image' src='styles/media/edit.png' alt='edit comment'>
    <input data-action='delete-comment' type='image' src='styles/media/delete.png' alt='delete comment'>
    </li>`
  }
}
