import { gql } from "@apollo/client"

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
    title,
    author
  }
}`

export const ALL_BOOKS = gql`query {
  allBooks {
    title
    author
    published
  }
}
`

export const ALL_AUTHORS = gql`query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const MODIFY_AUTHOR = gql`
mutation changeBirthdate($name: String!, $newBirthdate: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $newBirthdate
  ) {
  name,
  born
  }
}`