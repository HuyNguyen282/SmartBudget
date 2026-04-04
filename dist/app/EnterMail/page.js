"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnterMail;
const react_1 = require("react");
require("./EnterMail.css");
const link_1 = __importDefault(require("next/link"));
function EnterMail() {
    const [showNew, setShowNew] = (0, react_1.useState)(false);
    const [showConfirm, setShowConfirm] = (0, react_1.useState)(false);
    return (<div className="main-container">
      <div className="left-section">
        <h1>Enter your email to reset your password</h1>

        <form>
          <div className="form-group" style={{ position: "relative" }}>
            <input type="email" className="input-custom" placeholder="Enter Your Email"/>
            
          </div>

          <button type="submit" className="btn-primary">
            Reset Password
          </button>

          <div className="login-text">
            Remember your password?{" "}
            <link_1.default href="/signin" className="login-link">Login</link_1.default>
          </div>
        </form>
      </div>

      <div className="right-section">
        <img className="img" src="/icon.png" alt="App preview"/>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map