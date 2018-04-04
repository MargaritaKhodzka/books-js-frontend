class Comment {
  constructor (commentJSON) {
    this.content = commentJSON.content
  }

  render () {
    return `<li>${this.content}
    <button data-action='edit-book'>Edit</button>
    <button data-action='delete-book'>Delete</button></li>`
  }
}
