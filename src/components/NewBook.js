import { useState } from 'react'
import { useMutation } from '@apollo/client'
import {CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS} from '../queries'

const NewBook = ({ show, setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const updateBooks = (cache, { data: { addBook } }) => {
    cache.modify({ 
      fields: {
        allBooks(existingBooks = []) {
          cache.modify({ 
            fields: {
              allBooks(existingBooks = []) {
                const newBook = addBook
                cache.writeQuery({
                  query: ALL_BOOKS,
                  data: { newBook, ...existingBooks }
                })
              }
            }
          })
          return [...existingBooks, addBook];
          }
        }
    })
  }

  const [ createBook ] = useMutation(CREATE_BOOK, {
    update: updateBooks,
    refetchQueries: [ {query: ALL_BOOKS}, {query: ALL_AUTHORS} ],
    onQueryUpdated(observableQuery){
      // Define any custom logic for determining whether to refetch
        return observableQuery.refetch()
    },
    onError: (error) => {
        setError(error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unexpected error')
      },
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    createBook({ variables: { title, author, published, genres }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
