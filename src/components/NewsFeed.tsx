import { useState, useEffect } from 'react'

interface User {
  id: number
  username: string
  display_name: string
}

interface NewsPost {
  id: number
  title: string
  content: string
  username: string
  display_name: string
  created_at: string
}

interface Comment {
  id: number
  content: string
  username: string
  display_name: string
  created_at: string
}

interface NewsFeedProps {
  currentUser: User
}

function NewsFeed({ currentUser }: NewsFeedProps) {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({})
  const [newComment, setNewComment] = useState<{ [postId: number]: string }>({})
  const [expandedPost, setExpandedPost] = useState<number | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    fetch('http://localhost:3001/api/news')
      .then(res => res.json())
      .then(data => setPosts(data))
  }

  const loadComments = (postId: number) => {
    fetch(`http://localhost:3001/api/news/${postId}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(prev => ({ ...prev, [postId]: data }))
      })
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostTitle.trim() || !newPostContent.trim()) return

    fetch('http://localhost:3001/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUser.id,
        title: newPostTitle,
        content: newPostContent
      })
    })
      .then(res => res.json())
      .then(() => {
        setNewPostTitle('')
        setNewPostContent('')
        loadPosts()
      })
  }

  const handleAddComment = (postId: number) => {
    const commentText = newComment[postId]
    if (!commentText?.trim()) return

    fetch(`http://localhost:3001/api/news/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUser.id,
        content: commentText
      })
    })
      .then(res => res.json())
      .then(() => {
        setNewComment(prev => ({ ...prev, [postId]: '' }))
        loadComments(postId)
      })
  }

  const toggleComments = (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null)
    } else {
      setExpandedPost(postId)
      if (!comments[postId]) {
        loadComments(postId)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Neue Nachricht erstellen</h2>
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Titel"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Nachricht..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Veröffentlichen
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-3">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  Von: <span className="font-medium">{post.display_name}</span>
                </span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4">
              <button
                onClick={() => toggleComments(post.id)}
                className="text-blue-600 hover:text-blue-700 font-medium mb-3"
              >
                {expandedPost === post.id ? '▼ Kommentare ausblenden' : '▶ Kommentare anzeigen'}
              </button>

              {expandedPost === post.id && (
                <div>
                  {/* Comments List */}
                  <div className="space-y-3 mb-4">
                    {comments[post.id]?.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 mb-2">{comment.content}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-medium">{comment.display_name}</span>
                          <span>{formatDate(comment.created_at)}</span>
                        </div>
                      </div>
                    ))}
                    {(!comments[post.id] || comments[post.id].length === 0) && (
                      <p className="text-gray-500 text-sm">Noch keine Kommentare</p>
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kommentar schreiben..."
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id)
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Senden
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Noch keine Nachrichten vorhanden. Erstellen Sie die erste Nachricht!
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsFeed
