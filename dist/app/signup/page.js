"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignUp;
const react_1 = require("react");
require("./SignUp.css");
const link_1 = __importDefault(require("next/link"));
const axios_1 = __importDefault(require("@/lib/axios"));
function SignUp() {
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [showConfirm, setShowConfirm] = (0, react_1.useState)(false);
    const [firstName, setFirstName] = (0, react_1.useState)("");
    const [lastName, setLastName] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [phone, setPhone] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSignup = async () => {
        console.log("Đã bấm nút đăng ký!");
        setError("");
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios_1.default.post('/auth/register', {
                firstName,
                lastName,
                email,
                phone,
                password,
                confirmPassword,
            });
            console.log("Đăng ký thành công:", data);
            window.location.href = '/signin';
        }
        catch (err) {
            console.error("Lỗi:", err);
            setError(err.response?.data?.message || "Đăng ký thất bại!");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="main-container">
      <div className="left-section">
        <h1>
          Create Your Account!
          <br />
          I hope you have a great experience
        </h1>

        <form>
          <div className="row">
            <div className="form-group">
              <input type="text" className="input-custom" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </div>
            <div className="form-group">
              <input type="text" className="input-custom" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
            </div>
          </div>

          <div className="form-group">
            <input type="email" className="input-custom" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="form-group">
            <input type="tel" className="input-custom" placeholder="Enter Your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} className="input-custom" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} id="show-password" onClick={() => setShowPassword(!showPassword)}></i>
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input type={showConfirm ? "text" : "password"} className="input-custom" placeholder="Confirm Your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <i className={showConfirm ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} id="show-confirm" onClick={() => setShowConfirm(!showConfirm)}></i>
          </div>

          
          {error && (<p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
              {error}
            </p>)}

          <button type="button" className="btn-primary" onClick={handleSignup} disabled={loading}>
            {loading ? "Đang đăng ký..." : "Sign up"}
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <link_1.default href="/signin" className="login-link">
              Login
            </link_1.default>
          </p>
        </form>
      </div>

      <div className="right-section">
        <img src="/icon.png" alt="App preview" className="right-image"/>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map