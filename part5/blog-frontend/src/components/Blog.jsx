import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  return (
    <div style={{
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }}>
      <p>{blog.title} <button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'View'}</button></p>
      {visible && <div>
        <p>{blog.url}</p>
        <p>Likes {blog.likes} <button>Like</button></p>
        <p>{blog.author}</p>
      </div>}
    </div>
  )
}

export default Blog