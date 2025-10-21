import { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

interface User {
  id: number
  username: string
  display_name: string
}

interface ChatMessage {
  id: number
  message: string
  username: string
  display_name: string
  created_at: string
}

interface ChatProps {
  currentUser: User
}

function Chat({ currentUser }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load initial messages
    fetch('http://localhost:3001/api/chat/messages')
      .then(res => res.json())
      .then(data => setMessages(data))

    // Connect to Socket.io
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    // Listen for incoming messages
    newSocket.on('chat_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    socket.emit('chat_message', {
      user_id: currentUser.id,
      message: newMessage,
      username: currentUser.username,
      display_name: currentUser.display_name
    })

    setNewMessage('')
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Team Chat</h2>
          <p className="text-sm text-blue-100">Echtzeit-Kommunikation mit Kollegen</p>
        </div>

        {/* Messages Container */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, index) => {
            const isOwnMessage = msg.username === currentUser.username
            return (
              <div
                key={`${msg.id}-${index}`}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold mb-1 text-gray-600">
                      {msg.display_name}
                    </div>
                  )}
                  <div className="break-words">{msg.message}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Nachricht eingeben..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Senden
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
