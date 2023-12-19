import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const sortByVotes = (state) => state.sort((a, b) => a.votes < b.votes)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      const anecdote = action.payload
      state.push(anecdote)
    },
    updateAnecdote(state, action) {
      const anecdote = action.payload
      const index = state.findIndex((e) => e.id === anecdote.id)
      state[index] = anecdote
      return sortByVotes(state)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    dispatch(
      setAnecdotes(
        sortByVotes(await anecdoteService.getAll())
      )
    )
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    dispatch(appendAnecdote(await anecdoteService.createNew(content)))
  }
}

export const voteFor = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update(anecdote.id, { ...anecdote, votes: anecdote.votes + 1 })
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export const { appendAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer
