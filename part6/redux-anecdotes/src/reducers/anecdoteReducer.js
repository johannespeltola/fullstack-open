import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const sortByVotes = (state) => state.sort((a, b) => a.votes < b.votes)

const initialState = sortByVotes(anecdotesAtStart.map(asObject))

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push(asObject(content))
    },
    voteFor(state, action) {
      const id = action.payload
      const index = state.findIndex((e) => e.id === id)
      const oldValue = state[index]
      state[index] = { ...oldValue, votes: oldValue.votes + 1 }
      return sortByVotes(state)
    }
  }
})

export const { createAnecdote, voteFor } = anecdoteSlice.actions;
export default anecdoteSlice.reducer
