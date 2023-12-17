import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, canRemove }) => {
  const [visible, setVisible] = useState(false)
  return (
    <div style={{
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'View'}</button>
      </div>
      {visible && <div>
        <p>{blog.url}</p>
        <p>Likes {blog.likes} <button onClick={likeBlog}>Like</button></p>
        <p>{blog.user.name}</p>
        {canRemove && <button onClick={removeBlog}>Remove</button>}
      </div>}
    </div>
  )
}

export default Blog