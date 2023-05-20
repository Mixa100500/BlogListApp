import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginFrom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(compareLikes))
    )
  }, [])

  useEffect(() => {
    const user = storageService.loadUser()
    setUser(user)
  }, [])

  const compareLikes = (a, b) => {
    return b.likes - a.likes
  }

  const notifyWith = (message, type='info') => {
    setInfo({
      message: message,
      type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 3000)
  }


  const logout = async () => {
    storageService.removeUser()
    setUser(null)
    notifyWith('logged out')
  }

  const remove = async (blog) => {
    const ok = window.confirm(`Sure you want to remove '${blog.title}' by ${blog.author}`)
    if(ok) {
      await blogService.remove(blog)
      notifyWith(`The blog ${blog.title} by ${blog.author} removed`)
      setBlogs(blogs.filter(a => a.id !== blog.id))
    }
  }

  const login = async ({ username, password }) => {

    try {
      const user = await loginService.login({
        username, password,
      })
      storageService.saveUser(user)
      setUser(user)
      notifyWith(`login ${username}`)
    } catch (error) {
      notifyWith('wrong username or password', 'error')
    }
  }


  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      blogFormRef.current.toggleVisiblity()
      notifyWith(`a new blog ${blog.title} ${blog.author} added`, 'message')

      setBlogs(blogs.concat(newBlog))
    } catch (error) {
      notifyWith(error, 'error')
    }
  }

  const like = async (blog) => {
    try {
      const blogToUpdate = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      }
      const updatedBlog = await blogService
        .update(blogToUpdate)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    } catch (error) {
      notifyWith(error, 'error')
    }
  }


  if (!user) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification info={info}/>
        <LoginForm login={login}/>
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Togglable buttonLabel='create a new Blog' ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          canRemove={user && user.username === blog.user.username}
          key={blog.id}
          remove={() => remove(blog.id)}
          blog={blog}
          like={() => { like(blog) }}
        />
      )}
    </div>
  )
}

export default App