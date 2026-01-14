const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = (sum, blog) => {
    return sum + blog.likes
  }
    return blogs.reduce(total, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0
    ? 0
    : blogs.reduce((prev, current) => 
        (prev.likes > current.likes) 
        ? prev 
        : current)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}