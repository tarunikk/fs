const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = (sum, blog) => {
    return sum + blog.likes
  }
    return blogs.reduce(total, 0)
}

module.exports = {
  dummy,
  totalLikes,
}