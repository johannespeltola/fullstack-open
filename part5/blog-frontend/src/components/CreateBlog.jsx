import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
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
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title:
          <input data-testid="title-input" type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          Author:
          <input data-testid="author-input" type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          URL:
          <input data-testid="url-input" type="text" value={url} name="URL" onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button data-testid="create-blog-button" type="submit">Create</button>
      </form>
    </Togglable>
  )
})


CreateBlog.propTypes = {
  submit: PropTypes.func.isRequired
}

CreateBlog.displayName = 'CreateBlog'

export default CreateBlog
