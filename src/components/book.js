class Book {
  constructor(bookJSON) {
    this.title = bookJSON.title
    this.id = bookJSON.id
  }

  renderShow() {
    return `<h3>${this.title}</h3>`
  }

  render() {
    return `<li data-bookid='${this.id}' data-props='${JSON.stringify(
      this
    )}' class='book-element'><a class="show-link" href='#'>${
      this.title
    }</a><button data-action='edit-book'>Edit</button><button data-action='delete-book'>Delete</button></li>`
  }
}
