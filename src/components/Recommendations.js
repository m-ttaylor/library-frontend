import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommendations = (props) => {
  console.log('favourite genre is', props.favouriteGenre)
  const result = useQuery(ALL_BOOKS, {variables: {genre: props.favouriteGenre}})
  // const userResult = useQuery(CURRENT_USER)

  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

  if (result.loading) {
    return <div>loading...</div>
  }

  
  // const filteredBooks = favouriteGenre !== '' ? books.filter(b => b.genres.includes(favouriteGenre)) : books
  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre {props.favouriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
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