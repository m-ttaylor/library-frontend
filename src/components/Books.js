import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ show, genreFilter, setGenreFilter, genres }) => {
  
  const result = useQuery(ALL_BOOKS, {variables: {genre: genreFilter}})
  console.log('result is', result)

  if (!show) {
    return null
  }  

  if (result.loading) {
    return <div>loading...</div>
  }

  const filteredBooks = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      <p>filter: {genreFilter}</p>
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
      
    {[...genres].map((genre, i) => ( // doing bad key praxis here as it _should_ be safe; we can't add
    // genres in this view and we don't care about preserving their relative order. A better solution
    // would require backend changes to store unique genres with keys
      <GenreButton onClick={() => setGenreFilter(genre)} key={i} genre={genre} />
    ))}
    <GenreButton onClick={() => setGenreFilter("")} genre='clear' />
    </div>
  )
}

const GenreButton = ({onClick, genre}) => (
  <button onClick={onClick}>{genre}</button>
)

export default Books
