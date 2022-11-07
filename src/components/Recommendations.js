import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'
import { useState } from 'react'

const Recommendations = (props) => {

  const result = useQuery(ALL_BOOKS)
  const userResult = useQuery(CURRENT_USER)

  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

  if (result.loading || userResult.loading) {
    return <div>loading...</div>
  }

  const user = userResult.data.me
  console.log('user is', user)
  const favouriteGenre = user ? user.favouriteGenre : ''
  console.log('favourite genre is:', favouriteGenre)

  const filteredBooks = favouriteGenre !== '' ? books.filter(b => b.genres.includes(favouriteGenre)) : books
  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre {favouriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations