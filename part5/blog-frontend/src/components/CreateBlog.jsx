import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Togglable from './Togglable'

const CreateBlog = forwardRef(({ submit }, refs) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const blogRef = useRef()

  const handleSubmit = async (event) => {
    event.preventDefault()
    submit({ title, author, url })
  }

  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
    blogRef.current.toggleVisibility()
  }

  useImperativeHandle(refs, () => ({ clearForm }))

  return (
    <Togglable ref={blogRef} buttonLabel='New Note'>
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
})

export default CreateBlog
