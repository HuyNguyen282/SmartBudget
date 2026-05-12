'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersPage;
const react_query_1 = require("@tanstack/react-query");
const axios_1 = __importDefault(require("@/lib/axios"));
function UsersPage() {
    const { data, isLoading, error } = (0, react_query_1.useQuery)({
        queryKey: ['users'],
        queryFn: () => axios_1.default.get('/users').then(res => res.data),
    });
    if (isLoading)
        return <p>Đang tải...</p>;
    if (error)
        return <p>Lỗi!</p>;
    return (<ul>
      {data.map((user) => (<li key={user.id}>{user.name}</li>))}
    </ul>);
}
//# sourceMappingURL=page.js.map