"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetPwd;
const react_1 = require("react");
require("./ResetPwd.css");
const link_1 = __importDefault(require("next/link"));
const axios_1 = __importDefault(require("@/lib/axios"));
function ResetPwd() {
    const [showNew, setShowNew] = (0, react_1.useState)(false);
    const [showConfirm, setShowConfirm] = (0, react_1.useState)(false);
    const [newPassword, setNewPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleResetPassword = async () => {
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }
        setLoading(true);
        try {
            const token = new URLSearchParams(window.location.search).get("token");
            const { data } = await axios_1.default.post("/auth/reset-password", {
                token,
                newPassword,
                confirmPassword,
            });
            console.log("Reset thành công:", data);
            window.location.href = "/signin";
        }
        catch (err) {
            setError(err.response?.data?.message || "Reset mật khẩu thất bại!");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="main-container">
      <div className="left-section">
        <h1>
          Enter your email to reset your password
        </h1>

        <form>
          <div className="form-group" style={{ position: "relative" }}>
            <input type={showNew ? "text" : "password"} className="input-custom" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            <i className={showNew ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} id="show-new" onClick={() => setShowNew(!showNew)}></i>
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input type={showConfirm ? "text" : "password"} className="input-custom" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <i className={showConfirm ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} id="show-confirm" onClick={() => setShowConfirm(!showConfirm)}></i>
          </div>

          {error && (<p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              {error}
            </p>)}

          <button type="button" className="btn-primary" onClick={handleResetPassword} disabled={loading}>
            {loading ? "Đang xử lý..." : "Reset Password"}
          </button>

          <div className="login-text">
            Remember your password?{" "}
            <link_1.default href="/signin" className="login-link">
              Login
            </link_1.default>
          </div>
        </form>
      </div>

      <div className="right-section">
        <img className="img" src="/icon.png" alt="App preview"/>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map