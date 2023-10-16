// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => prev + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((prev, current) => (prev?.likes > current.likes) ? prev : current, null)
  return favorite
}

const mostBlogs = (blogs) => {
  if (!blogs.length) return null
  // Sort list by author
  const sorted = blogs.sort((a, b) =>
    blogs.filter(e => e.author === a.author).length
    - blogs.filter(e => e.author === b.author).length
  )
  // Max element at end of list
  const max = sorted.at(-1)
  return {
    author: max.author,
    blogs: sorted.filter(e => e.author === max.author).length
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}