const Blog = ({ blog, addLike, removeBlog, user }) => {

  return (
    <li className="blog">
      <div>
        {blog.title} <br />
        {blog.author} <br />
        {blog.url}
        <div>
          Likes: {blog.likes}
          <button onClick={addLike}>like</button>
        </div>
        {blog.user &&
          <div>{blog.user.name}</div>}
        {blog.user &&
        <div>
          {blog.user.name === user.name &&
            <button onClick={removeBlog}>delete</button>
          }
        </div>
        }
      </div>
    </li>
  )}

export default Blog