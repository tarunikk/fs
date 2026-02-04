import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content',  async () => {
  const blog = {
    title: 'Title of a blog',
    likes: 10
  }

  render(<Blog blog={blog} />  )

  const element = screen.getAllByText('Title of a blog')

  expect(element).toBeDefined()
})