"use client"
import { useState } from "react"
import "./SignIn.css"
import api from '@/lib/axios'
import Link from "next/link"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    console.log("Đã bấm nút!");
    setError("")
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      console.log("Đăng nhập thành công:", data)

      // Lưu token nếu có
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }

      // Chuyển trang sau khi login thành công
      window.location.href = '/users'

    } catch (err: any) {
      console.error("Lỗi:", err)
      setError(err.response?.data?.message || "Đăng nhập thất bại!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-container">
      <div className="left-section">
        <h1>
          LET'S start by logging to your
          <br />
          SmartBudget account
        </h1>

        <form>
          <div className="form-group">
            <input
              type="email"
              className="input-custom"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // ← thêm
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="input-custom"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // ← thêm
            />
            <i
              className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
              id="show-password"
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* Hiện lỗi nếu có */}
          {error && (
            <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>
          )}

          <div className="options-row" style={{ margin: "0", fontWeight: "400", color: "#0E64D1", fontSize: "14px" }}>
            <div className="remember-me">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="/EnterMail" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Log In"}
          </button>

          <Link href="/signup" className="btn-dark" style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "10px",
            backgroundColor: "#111827",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "600",
            width: "100%",
            height: "48px",
            marginBottom: "15px"
          }}>
            Đăng ký
          </Link>
        </form>
      </div>

      <div className="right-section">
        <img className="img" src="\icon.png" alt="App preview" />
      </div>
    </div>
  )
}