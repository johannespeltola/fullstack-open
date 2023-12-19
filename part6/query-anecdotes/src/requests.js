import axios from 'axios'

export const getAnecdotes = () =>
  axios.get('http://localhost:3001/anecdotes')
    .then((res) => res.data)

export const createAnecdote = (anecdote) =>
  axios.post('http://localhost:3001/anecdotes', anecdote)
    .then((res) => res.data)
