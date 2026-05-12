'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Test;
const react_1 = require("react");
const axios_1 = __importDefault(require("@/lib/axios"));
function Test() {
    (0, react_1.useEffect)(() => {
        axios_1.default.get("/")
            .then(res => console.log("DATA:", res.data))
            .catch(err => console.error("ERROR:", err));
    }, []);
    return <div>Test API</div>;
}
//# sourceMappingURL=page.js.map