"use client"
import { useState } from "react"
import "./EnterMail.css"
import Link from "next/link"
import api from '@/lib/axios'

export default function EnterMail() {
<<<<<<< HEAD
  const [account, setAccount]   = useState("")
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState("")
  const [success, setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!account) {
      setError("Vui lòng nhập email hoặc số điện thoại.")
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { account })
      setSuccess(true)
    } catch (err: any) {
      const msg = err.response?.data?.message
      if (Array.isArray(msg)) setError(msg[0])
      else setError(msg || "Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }
=======
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0

  return (
    <div className="main-container">
      <div className="left-section">
        <h1>Enter your email to reset your password</h1>

<<<<<<< HEAD
        {success ? (
          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "green", fontSize: "15px", marginBottom: "16px" }}>
              ✓ Đã gửi link đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.
            </p>
            <Link href="/signin" className="login-link">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ position: "relative" }}>
              <input
                type="text"
                className="input-custom"
                placeholder="Enter Your Email or Phone Number"
                value={account}
                onChange={(e) => { setAccount(e.target.value); setError("") }}
              />
            </div>

            {error && (
              <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Reset Password"}
            </button>

            <div className="login-text">
              Remember your password?{" "}
              <Link href="/signin" className="login-link">Login</Link>
            </div>
          </form>
        )}
=======
        <form>
          <div className="form-group" 
            style={{ position: "relative" }}>
            <input
              type="email"
              className="input-custom"
              placeholder="Enter Your Email"
            />
            
          </div>

          <button type="submit" className="btn-primary">
            Reset Password
          </button>

          <div className="login-text">
            Remember your password?{" "}
            <Link href="/signin" className="login-link">Login</Link>
          </div>
        </form>
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
      </div>

      <div className="right-section">
        <img className="img" src="/icon.png" alt="App preview" />
      </div>
    </div>
  )
}