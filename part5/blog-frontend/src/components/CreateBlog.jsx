import { useState } from 'react'

const CreateBlog = ({ submit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (await submit({ title, author, url })) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
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
    </div>
  );
}

export default CreateBlog
