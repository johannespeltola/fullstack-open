import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

test('create blog works as expected', async () => {
  const newBlog = {
    title: 'Title 2',
    author: 'Mr. Author',
    url: 'URL.com'
  }
  const user = userEvent.setup()
  const mockHandler = jest.fn()

  render(<CreateBlog submit={mockHandler} />)

  const titleInput = screen.getByTestId('title-input')
  const authorInput = screen.getByTestId('author-input')
  const urlInput = screen.getByTestId('url-input')
  const submitButton = screen.getByTestId('create-blog-button')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)

  await user.click(submitButton)

  const [createdBlog] = mockHandler.mock.calls[0]

  expect(createdBlog.title).toEqual(newBlog.title)
  expect(createdBlog.author).toEqual(newBlog.author)
  expect(createdBlog.url).toEqual(newBlog.url)
})
