import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector((state) => state.filter)
  const anecdotes = useSelector((state) => state.anecdotes).filter(
    (e) => e.content
      .toLowerCase()
      .search(filter.toLowerCase()) > -1)

  const vote = (anecdote) => {
    dispatch(voteFor(anecdote))
    dispatch(setNotification(`You voted for '${anecdote.content}'`))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList