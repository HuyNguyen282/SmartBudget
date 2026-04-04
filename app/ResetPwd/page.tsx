"use client"
import { useState } from "react"
import "./ResetPwd.css"
import Link from "next/link"
import api from "@/lib/axios"

export default function ResetPwd() {
  const [showNew, setShowNew] = useState(false)        // ← đổi tên cho đúng
  const [showConfirm, setShowConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!")
      return
    }

    setLoading(true)
    try {
      // Lấy token từ URL: /reset-password?token=xxx
      const token = new URLSearchParams(window.location.search).get("token")

      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      })

      console.log("Reset thành công:", data)
      window.location.href = "/signin"

    } catch (err: any) {
      setError(err.response?.data?.message || "Reset mật khẩu thất bại!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-container">
      <div className="left-section">
        <h1>
          Enter your email to reset your password
        </h1>

        <form>
          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showNew ? "text" : "password"}
              className="input-custom"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <i
              className={showNew ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
              id="show-new"
              onClick={() => setShowNew(!showNew)}
            ></i>
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              className="input-custom"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className={showConfirm ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
              id="show-confirm"
              onClick={() => setShowConfirm(!showConfirm)}
            ></i>
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <button
            type="button"        // ← đổi submit thành button
            className="btn-primary"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Reset Password"}
          </button>

          <div className="login-text">
            Remember your password?{" "}
            <Link href="/signin" className="login-link">
              Login
            </Link>
          </div>
        </form>
      </div>

      <div className="right-section">
        <img className="img" src="/icon.png" alt="App preview" />
      </div>
    </div>
  )
}