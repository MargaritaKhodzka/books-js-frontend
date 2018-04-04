class Comment {
  constructor (commentJSON, bookId) {
    this.content = commentJSON.content
    this.id = commentJSON.id
    this.bookId = bookId
  }

  render () {
    return `<li data-commentid='${this.id}' data-bookid='${this.bookId}'>
    ${this.content}</li>`
  }
}
