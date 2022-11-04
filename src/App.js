import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

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

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? <button onClick={() => setPage('add')}>add book</button> : null }
        <button onClick={() => setPage('login')}>{token? "log out" : "login"}</button>
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors setError={notify} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook setError={notify} show={page === 'add'} />

      <LoginForm setError={notify} setToken={setToken} logout={logout} token={token} show={page === 'login'} />
    </div>
  )
}

export default App
