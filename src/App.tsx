import { useState, useEffect } from 'react'
import NewsFeed from './components/NewsFeed'
import Chat from './components/Chat'

interface User {
  id: number
  username: string
  display_name: string
}

function App() {
  const [activeTab, setActiveTab] = useState<'news' | 'chat'>('news')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Load users
    fetch('http://localhost:3001/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        // Set first user as default
        if (data.length > 0) {
          setCurrentUser(data[0])
        }
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Unternehmens-App</h1>
            {currentUser && (
              <div className="flex items-center gap-4">
                <span className="text-sm">Angemeldet als: {currentUser.display_name}</span>
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const user = users.find(u => u.id === parseInt(e.target.value))
                    if (user) setCurrentUser(user)
                  }}
                  className="bg-blue-700 text-white px-3 py-1 rounded border border-blue-500 text-sm"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.display_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'news'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              News Feed
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Chat
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'news' && currentUser && <NewsFeed currentUser={currentUser} />}
        {activeTab === 'chat' && currentUser && <Chat currentUser={currentUser} />}
      </main>
    </div>
  )
}

export default App
