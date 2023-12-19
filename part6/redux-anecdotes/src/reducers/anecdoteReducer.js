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
    voteFor(state, action) {
      const id = action.payload
      const index = state.findIndex((e) => e.id === id)
      const oldValue = state[index]
      state[index] = { ...oldValue, votes: oldValue.votes + 1 }
      return sortByVotes(state)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    dispatch(setAnecdotes(await anecdoteService.getAll()))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    dispatch(appendAnecdote(await anecdoteService.createNew(content)))
  }
}

export const { appendAnecdote, voteFor, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer
