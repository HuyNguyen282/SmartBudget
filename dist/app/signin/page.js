"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignUp;
const react_1 = require("react");
require("./SignIn.css");
const axios_1 = __importDefault(require("@/lib/axios"));
const link_1 = __importDefault(require("next/link"));
function SignUp() {
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleLogin = async () => {
        console.log("Đã bấm nút!");
        setError("");
        setLoading(true);
        try {
            const { data } = await axios_1.default.post('/auth/login', { email, password });
            console.log("Đăng nhập thành công:", data);
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
            }
            window.location.href = '/users';
        }
        catch (err) {
            console.error("Lỗi:", err);
            setError(err.response?.data?.message || "Đăng nhập thất bại!");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="main-container">
      <div className="left-section">
        <h1>
          LET'S start by logging to your
          <br />
          SmartBudget account
        </h1>

        <form>
          <div className="form-group">
            <input type="email" className="input-custom" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} className="input-custom" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} id="show-password" onClick={() => setShowPassword(!showPassword)}></i>
          </div>

          
          {error && (<p style={{ color: 'red', fontSize: '14px' }}>{error}</p>)}

          <div className="options-row" style={{ margin: "0", fontWeight: "400", color: "#0E64D1", fontSize: "14px" }}>
            <div className="remember-me">
              <input type="checkbox" id="rememberMe"/>
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="/EnterMail" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="button" className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Log In"}
          </button>

          <link_1.default href="/signup" className="btn-dark" style={{
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
          </link_1.default>
        </form>
      </div>

      <div className="right-section">
        <img className="img" src="\icon.png" alt="App preview"/>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map