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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}