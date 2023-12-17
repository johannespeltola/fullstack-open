import { useState } from 'react'

const Blog = ({ blog, like }) => {
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
        <p>Likes {blog.likes} <button onClick={like}>Like</button></p>
        <p>{blog.user.name}</p>
      </div>}
    </div>
  )
}

export default Blog