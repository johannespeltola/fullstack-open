import { useState } from 'react'
import Togglable from './Togglable'

const CreateBlog = ({ submit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [visible, setVisible] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (await submit({ title, author, url })) {
      setTitle('')
      setAuthor('')
      setUrl('')
      setVisible(false)
    }
  }

  return (
    <Togglable visible={visible} setVisible={setVisible} buttonLabel='New Note'>
      <form onSubmit={handleSubmit}>
        <div>
          Title:
          <input type="text" value={title} name="Username" onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          Author:
          <input type="text" value={author} name="Password" onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          URL:
          <input type="text" value={url} name="Password" onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>
    </Togglable>
  );
}

export default CreateBlog
