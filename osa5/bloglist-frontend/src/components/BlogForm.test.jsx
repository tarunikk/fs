import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const addBlog = vi.fn()

  render(<BlogForm createBlog={addBlog} />)

  const inputTitle = screen.getByLabelText('title:')
  const inputAuthor = screen.getByLabelText('author:')
  const inputUrl = screen.getByLabelText('url:')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'testing a form...')
  await user.type(inputAuthor, 'author example')
  await user.type(inputUrl, 'testing.com')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(addBlog.mock.calls[0][0].author).toBe('author example')
  expect(addBlog.mock.calls[0][0].url).toBe('testing.com')

  console.log(addBlog.mock.calls)
})