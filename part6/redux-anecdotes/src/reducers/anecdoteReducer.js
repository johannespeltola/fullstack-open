import { createSlice } from '@reduxjs/toolkit'

const sortByVotes = (state) => state.sort((a, b) => a.votes < b.votes)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push(content)
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

export const { createAnecdote, voteFor, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer
