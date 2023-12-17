import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('default renders only title and author', () => {
  const blog = {
    title: 'Title',
    author: 'Mr. Author',
    url: 'google.com',
    likes: 12,
    user: '657f06d10cd7c31ce3e6d826'
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText(`${blog.title} ${blog.author}`)
  expect(title).toBeDefined()
  const url = screen.queryByText(blog.url)
  expect(url).toBeNull()
  const likes = screen.queryByText(blog.likes)
  expect(likes).toBeNull()
})

test('url and likes shown when expanded', async () => {
  const blog = {
    title: 'Title',
    author: 'Mr. Author',
    url: 'google.com',
    likes: 12,
    user: '657f06d10cd7c31ce3e6d826'
  }

  const user = userEvent.setup()

  render(<Blog blog={blog} />)

  const button = screen.getByText('View')

  await user.click(button)

  const title = screen.getByText(`${blog.title} ${blog.author}`)
  expect(title).toBeDefined()
  const url = screen.getByText(blog.url)
  expect(url).toBeDefined()
  const likes = screen.getByText(`Likes ${blog.likes}`)
  expect(likes).toBeDefined()
})
