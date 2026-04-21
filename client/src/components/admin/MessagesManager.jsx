import React, { useState, useEffect } from "react"
import { messagesAPI } from "../../services/api"
import {
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaEnvelopeOpen,
} from "react-icons/fa"

const MessagesManager = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
  })

  useEffect(() => {
    fetchMessages()
  }, [pagination.currentPage])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await messagesAPI.getAllMessages(
        pagination.currentPage,
        10,
      )
      setMessages(response.data.data.messages)
      setPagination(response.data.data.pagination)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setError("Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return
    }

    try {
      await messagesAPI.deleteMessage(id)
      setMessages(messages.filter((msg) => msg._id !== id))
      if (selectedMessage?._id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      setError("Failed to delete message")
    }
  }

  const handleMarkAsRead = async (id, isRead) => {
    try {
      await messagesAPI.markAsRead(id, isRead)
      setMessages(
        messages.map((msg) => (msg._id === id ? { ...msg, isRead } : msg)),
      )
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead })
      }
    } catch (error) {
      console.error("Error updating message:", error)
      setError("Failed to update message")
    }
  }

  const handleViewMessage = async (message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      await handleMarkAsRead(message._id, true)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600 dark:text-gray-300">
          Loading messages...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages ({pagination.totalMessages})
        </h2>
        <button
          onClick={fetchMessages}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Messages List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inbox
          </h3>

          {messages.length === 0 ? (
            <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              No messages found
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    message.isRead
                      ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                      : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                  } ${
                    selectedMessage?._id === message._id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {message.isRead ? (
                          <FaEnvelopeOpen className="text-gray-400" />
                        ) : (
                          <FaEnvelope className="text-blue-500" />
                        )}
                        <h4
                          className={`truncate text-sm font-medium ${
                            message.isRead
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-blue-900 dark:text-blue-100"
                          }`}
                        >
                          {message.name}
                        </h4>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
                        {message.subject}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(message._id, !message.isRead)
                        }}
                        className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                        title={
                          message.isRead ? "Mark as unread" : "Mark as read"
                        }
                      >
                        {message.isRead ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteMessage(message._id)
                        }}
                        className="rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300"
                        title="Delete message"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                disabled={!pagination.hasPrev}
                className="rounded-lg bg-gray-200 px-3 py-1 text-sm disabled:opacity-50 dark:bg-gray-700"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                disabled={!pagination.hasNext}
                className="rounded-lg bg-gray-200 px-3 py-1 text-sm disabled:opacity-50 dark:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Message Details
          </h3>

          {selectedMessage ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    From:
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedMessage.name} ({selectedMessage.email})
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject:
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedMessage.subject}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date:
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message:
                  </label>
                  <div className="mt-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesManager
