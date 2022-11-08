import { useState } from 'react'
import { useApolloClient, useSubscription, useQuery } from '@apollo/client'
import { BOOK_ADDED, CURRENT_USER, ALL_BOOKS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  console.log('hitting update cache helper')
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState('')
  const [token, setToken] = useState(null)
  const [genreFilter, setGenreFilter] = useState('')
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData, client }) => {
      console.log('subscriptionData', subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS, variables: {genre: genreFilter} }, addedBook)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 1000)
  }

  const userResult = useQuery(CURRENT_USER)
  const result = useQuery(ALL_BOOKS)

  if (userResult.loading || result.loading) {
    return (
      <div>loading...</div>
    )
  }
  const user = userResult.data.me
  console.log('user is', user)
  console.log(user ? user.favouriteGenre : '')

  const books = result.data.allBooks
  const genres = new Set(books.map(b => b.genres).reduce((a, b) => a.concat(b), []))

  // console.log('favourite genre is:', favouriteGenre)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? <button onClick={() => setPage('add')}>add book</button> : null }
        { token ? <button onClick={() => setPage('recommendations')}>recommendations</button> : null}
        <button onClick={() => setPage('login')}>{token? "log out" : "login"}</button>
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors setError={notify} show={page === 'authors'} />

      <Books show={page === 'books'} genres={genres} genreFilter={genreFilter} setGenreFilter={setGenreFilter} />

      <NewBook setError={notify} show={page === 'add'} genreFilter={genreFilter}/>

      <Recommendations setError={notify} show={page === 'recommendations'} favouriteGenre={user ? user.favouriteGenre : ''} />

      <LoginForm setError={notify} setToken={setToken} logout={logout} token={token} show={page === 'login'} />
    </div>
  )
}

export default App
