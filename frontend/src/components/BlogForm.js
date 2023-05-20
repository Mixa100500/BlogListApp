import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
        title:
          <input
            id='title'
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title of the blog'
            type="text"
            value={title}
          />
        </div>
        <div>
        author:
          <input
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author of the blog'
            id='author'
            type="text"
            value={author}
          />
        </div>
        <div>
        url:
          <input
            id='url'
            onChange={({ target }) => setUrl(target.value)}
            placeholder='url of the blog'
            type="text"
            value={url}
          />
        </div>
        <button id='create-butto' type='submit'>send</button>
      </form>
    </div>
  )
}

export default BlogForm