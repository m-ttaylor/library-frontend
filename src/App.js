import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { CURRENT_USER } from './queries'
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

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState('')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

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

  if (userResult.loading) {
    return (
      <div>loading...</div>
    )
  }
  const user = userResult.data.me
  console.log('user is', user)
  // favouriteGenre = user ? user.favouriteGenre : ''
  // console.log('favourite genre is:', favouriteGenre)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? <button onClick={() => setPage('add')}>add book</button> : null }
        { token && user ? <button onClick={() => setPage('recommendations')}>recommendations</button> : null}
        <button onClick={() => setPage('login')}>{token? "log out" : "login"}</button>
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors setError={notify} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook setError={notify} show={page === 'add'} />

      <Recommendations setError={notify} show={page === 'recommendations'} favouriteGenre={user.favouriteGenre} />

      <LoginForm setError={notify} setToken={setToken} logout={logout} token={token} show={page === 'login'} />
    </div>
  )
}

export default App
