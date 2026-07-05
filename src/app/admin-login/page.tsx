'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function AdminLogin() {
  const [nextPath, setNextPath] = useState('/admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const nextParam = new URLSearchParams(window.location.search).get('next')

    if (nextParam?.startsWith('/') && !nextParam.startsWith('//')) {
      setNextPath(nextParam)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, next: nextPath }),
      })

      const result = await response.json() as { message?: string; redirectTo?: string }

      if (!response.ok) {
        throw new Error(result.message || 'Login failed.')
      }

      window.location.assign(result.redirectTo || '/admin')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-[#f4f7fa] px-5 py-12">
      <section className="w-full max-w-md border border-[#d5dce5] bg-white p-7 shadow-[0_26px_90px_rgba(7,17,31,0.12)] md:p-9">
        <Image
          src="/brand/meraba-logo.png"
          alt="MERABA"
          width={2172}
          height={724}
          priority
          unoptimized
          className="mb-8 h-auto w-40 object-contain"
        />

        <p className="section-label">Admin</p>
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1] tracking-[-0.045em] text-gray-950">
          Sign in to manage content.
        </h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          Authorized MERABA website editors only.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-username" className="mb-3 block text-xs font-bold uppercase text-gray-600">
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full border border-[#c8d1dc] bg-white px-4 py-4 text-gray-950 outline-none transition-smooth focus:border-meraba"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-3 block text-xs font-bold uppercase text-gray-600">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full border border-[#c8d1dc] bg-white px-4 py-4 text-gray-950 outline-none transition-smooth focus:border-meraba"
            />
          </div>

          {error && (
            <p className="border border-[#e1c2c2] bg-[#fff7f7] px-4 py-3 text-sm font-medium text-[#8f3f3f]">
              {error}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
