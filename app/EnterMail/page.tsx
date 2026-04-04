"use client"
import { useState } from "react"
import "./EnterMail.css"
import Link from "next/link"
import api from '@/lib/axios'

export default function EnterMail() {
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="main-container">
      <div className="left-section">
        <h1>Enter your email to reset your password</h1>

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
      </div>

      <div className="right-section">
        <img className="img" src="/icon.png" alt="App preview" />
      </div>
    </div>
  )
}