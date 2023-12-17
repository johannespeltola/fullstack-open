import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => { token = `Bearer ${newToken}` }

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async ({ title, author, url }) => {
  const res = await axios.post(
    baseUrl,
    { title, author, url },
    { headers: { Authorization: token } }
  )
  return res.data
}

const update = async (id, blog) => {
  const res = await axios.put(`${baseUrl}/${id}`, blog)
  return res.data
}

export default {
  getAll,
  create,
  setToken,
  update
}
