import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import { useState } from 'react'
import { ALL_AUTHORS, MODIFY_AUTHOR } from '../queries'


const Authors = ({ show, setError }) => {

  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [ birthdate, setBirthdate ] = useState(0);

  const result = useQuery(ALL_AUTHORS)

  const [ changeBirthdate ] = useMutation(MODIFY_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })
  
  if (!show) return null

  const handleAuthorChange = (newAuthor) => {
    setSelectedAuthor(newAuthor)
    const authorData = result.data.allAuthors.find( a => a.name === newAuthor.value )
    const birthdate = authorData.born ? authorData.born : ''
    setBirthdate(birthdate)
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log(`modifiying author ${selectedAuthor.value}'s birthdate...`)
    
    changeBirthdate({ variables: { name: selectedAuthor.value, newBirthdate: parseInt(birthdate) }})

    setBirthdate(0)
    setSelectedAuthor(null)
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors  
  const options = authors.map(a => {
    return {value: a.name, label: a.name}
  })

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <form onSubmit={submit}>
      <Select
        // defaultValue={selectedAuthor}
        value={selectedAuthor}
        onChange={(selectedAuthor) => handleAuthorChange(selectedAuthor)}
        options={options}
      />
      <div>
        born:
        <input
          value={birthdate}
          onChange={({ target }) => setBirthdate(target.value)}
        />
      </div>
      <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
