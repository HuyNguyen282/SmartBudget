"use client"
import { useState } from "react"
import "./SignUp.css"
import Link from "next/link"
import api from '@/lib/axios'  // ← thêm import

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // ← thêm state cho các field
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    console.log("Đã bấm nút đăng ký!")
    setError("")

    // Validate password
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!")
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
      })
      console.log("Đăng ký thành công:", data)
      // Chuyển sang trang login sau khi đăng ký
      window.location.href = '/signin'

    } catch (err: any) {
      console.error("Lỗi:", err)
      setError(err.response?.data?.message || "Đăng ký thất bại!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-container">
      <div className="left-section">
        <h1>
          Create Your Account!
          <br />
          I hope you have a great experience
        </h1>

        <form>
          <div className="row">
            <div className="form-group">
              <input
                type="text"
                className="input-custom"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="input-custom"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              className="input-custom"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              className="input-custom"
              placeholder="Enter Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="input-custom"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
              id="show-password"
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              className="input-custom"
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className={showConfirm ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
              id="show-confirm"
              onClick={() => setShowConfirm(!showConfirm)}
            ></i>
          </div>

          {/* Hiện lỗi nếu có */}
          {error && (
            <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
              {error}
            </p>
          )}

          <button
            type="button"
            className="btn-primary"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Sign up"}
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <Link href="/signin" className="login-link">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="right-section">
        <img src="/icon.png" alt="App preview" className="right-image" />
      </div>
    </div>
  )
}
