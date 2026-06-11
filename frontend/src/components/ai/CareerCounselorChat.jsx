import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import AiBadge from './AiBadge.jsx'
import {
  sendChatMessage,
  fetchChatSessions,
  fetchChatMessages,
} from '../../services/chat.js'

const SUGGESTED_PROMPTS = [
  'Why was my top career recommended?',
  "I don't like desk jobs — what fits me better?",
  'What should I study next for my top match?',
]

// How fast the reply "types" itself out, in ms per token (word/space).
const REVEAL_INTERVAL = 22

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl border border-indigo-100 bg-white px-4 py-3">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function CareerCounselorChat({ topMatch }) {
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false) // waiting on the LLM ("thinking")
  const [typing, setTyping] = useState(false) // streaming the reply out
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)
  const revealTimer = useRef(null)

  const busy = sending || typing

  // Resume the most recent counseling session, if one exists.
  useEffect(() => {
    if (!user) return
    let cancelled = false

    fetchChatSessions()
      .then((sessions) => {
        if (cancelled || !sessions?.length) return
        const latest = sessions[0]
        setSessionId(latest._id)
        return fetchChatMessages(latest._id)
      })
      .then((history) => {
        if (cancelled || !history) return
        setMessages(history.map((m) => ({ sender: m.sender, content: m.content })))
      })
      .catch(() => {
        // A missing history is not fatal — the student can start a fresh chat.
      })

    return () => {
      cancelled = true
    }
  }, [user])

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending, typing])

  // Clear any in-flight reveal timer on unmount.
  useEffect(() => () => clearTimeout(revealTimer.current), [])

  // Stream a finished reply in word-by-word for a natural "typing" feel.
  const revealReply = (fullText) => {
    const tokens = fullText.split(/(\s+)/) // keeps whitespace between words
    let i = 0

    setTyping(true)
    setMessages((prev) => [...prev, { sender: 'assistant', content: '' }])

    const step = () => {
      i += 1
      const partial = tokens.slice(0, i).join('')
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { sender: 'assistant', content: partial }
        return next
      })

      if (i < tokens.length) {
        revealTimer.current = setTimeout(step, REVEAL_INTERVAL)
      } else {
        setTyping(false)
      }
    }

    revealTimer.current = setTimeout(step, REVEAL_INTERVAL)
  }

  const submitQuestion = async (question) => {
    const trimmed = question.trim()
    if (!trimmed || busy) return

    setError(null)
    setInput('')
    setMessages((prev) => [...prev, { sender: 'user', content: trimmed }])
    setSending(true)

    try {
      const result = await sendChatMessage({ question: trimmed, sessionId })
      if (!sessionId) setSessionId(result.sessionId)
      revealReply(result.reply.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitQuestion(input)
  }

  if (!user) {
    return (
      <section className="ai-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Talk to your AI career counselor</h2>
            <p className="mt-1 text-sm text-slate-600">Sign in to discuss and refine your career recommendations.</p>
          </div>
          <Link to="/login" className="btn-ai">Sign in</Link>
        </div>
      </section>
    )
  }

  const lastIndex = messages.length - 1

  return (
    <section className="ai-panel p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">AI career counselor</h2>
            <AiBadge label="Chat" />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Ask why a career was recommended or how to move forward. Answers use your assessment profile.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-6 max-h-96 space-y-4 overflow-y-auto rounded-xl border border-indigo-100 bg-indigo-50/30 p-4"
      >
        {messages.length === 0 && !sending && (
          <div className="py-6 text-center text-sm text-slate-500">
            <p>
              👋 Hi {user.name?.split(' ')[0] || 'there'}! I'm your AI counselor.
              {topMatch ? ` Ask me anything about your top match, ${topMatch.name}, or your other recommendations.` : ' Ask me anything about your career recommendations.'}
            </p>
          </div>
        )}

        {messages.map((m, i) => {
          const isStreaming = typing && i === lastIndex && m.sender === 'assistant'
          return (
            <div
              key={i}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                    : 'border border-indigo-100 bg-white text-slate-700'
                }`}
              >
                {m.content}
                {isStreaming && (
                  <span className="ml-0.5 inline-block h-4 w-0.5 -translate-y-px animate-pulse bg-indigo-400 align-middle" />
                )}
              </div>
            </div>
          )
        })}

        {sending && <TypingDots />}
      </div>

      {messages.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => submitQuestion(prompt)}
              disabled={busy}
              className="rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          rows={1}
          maxLength={4000}
          placeholder="Ask your counselor a question…"
          className="input-field flex-1 resize-none"
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn-ai disabled:opacity-50">
          {sending ? 'Thinking…' : typing ? 'Replying…' : 'Send'}
        </button>
      </form>
    </section>
  )
}
