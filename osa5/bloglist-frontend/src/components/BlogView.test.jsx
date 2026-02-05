import { render, screen } from '@testing-library/react'
import BlogView from './BlogView'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<BlogView />', () =>  {
  beforeEach(() => {
    const blog = {
      id: 123,
      title: 'Title of a blog',
      author: 'joku',
      url: 'esim.com',
      likes: 10
    }

    render(
      <BlogView preview={blog.title + ' ' + blog.author}>
        <div>togglable content</div>
        <Blog blog={blog}/>
      </BlogView>
    )

    screen.debug()
  })

  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  test('renders title', () => {
    screen.getByText('Title of a blog joku')
  })

  test('at start the children are not displayed', () => {
    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })

  test('at start the preview is displayed', () => {
    const element = screen.getByText('Title of a blog joku')
    expect(element).toBeVisible()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    const element1 = screen.getByText('Likes: 10')
    expect(element1).toBeVisible()
    const element2 = screen.getByText('esim.com', { exact: false })
    expect(element2).toBeVisible()
  })
})

test('after clicking the like button twice, addLikeTo is called twice', async () => {
  const blog = {
    title: 'Title of a blog',
    author: 'joku',
    url: 'esim.com',
    likes: 10
  }

  const addLikeTo = vi.fn()

  render(
    <BlogView preview={blog.title + ' ' + blog.author}>
      <Blog blog={blog} addLike={addLikeTo} />
    </BlogView>
  )

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(addLikeTo.mock.calls).toHaveLength(2)

  console.log(addLikeTo.mock.calls)
})