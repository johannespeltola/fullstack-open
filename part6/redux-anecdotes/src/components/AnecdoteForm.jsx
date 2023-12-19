import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = async (event) => {
    try {
      event.preventDefault()
      const anecdote = event.target.anecdote.value
      event.target.anecdote.value = ''
      const newAnecdote = await anecdoteService.createNew(anecdote)
      dispatch(createAnecdote(newAnecdote))
      dispatch(setNotification(`Created anecdote '${anecdote}'`))
    } catch (error) {
      dispatch(setNotification('Failed to create anecdote'))
    }
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name='anecdote' /></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm