import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async (person) => {
  const res = await axios.post(baseUrl, person)
  return res.data
}

const destroy = async (id) => {
  const res = await axios.delete(`${baseUrl}/${id}`)
  return res.data
}

const update = async (id, person) => {
  const res = await axios.put(`${baseUrl}/${id}`, person)
  return res.data
}

export default { getAll, create, destroy, update }