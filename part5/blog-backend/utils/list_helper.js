// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => prev + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((prev, curr) => (prev?.likes > curr.likes) ? prev : curr, null)
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

const mostLikes = (blogs) => {
  if (!blogs.length) return null
  // Count total likes for each author
  const authors = Array.from(
    new Set(blogs.map((e) => e.author))
  ).map((e) => ({
    author: e,
    likes: blogs.filter((i) => i.author === e)
      .reduce((prev, curr) => prev + curr.likes, 0)
  }))
  // Return author with most likes
  return authors.reduce((prev, curr) => (prev?.likes > curr.likes) ? prev : curr, null)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}