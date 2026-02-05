import { render, screen } from '@testing-library/react'
import BlogView from './BlogView'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<BlogView />', () =>  {
  beforeEach(() => {
    const blog = {
      title: 'Title of a blog',
      author: 'joku',
      url: 'esim.com',
      likes: 10
    }

    render(
      <BlogView preview={blog.title + ' ' + blog.author}>
        <div>togglable content</div>
        <Blog blog={blog} />
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
    const button = screen.getByText('show')
    await user.click(button)

    const element = screen.getByText('Likes: 10')
    expect(element).toBeVisible()
  })
})