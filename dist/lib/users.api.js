"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
async function getUsers() {
    const res = await fetch(`${process.env.API_URL}/users`, {
        cache: 'no-store',
    });
    if (!res.ok)
        throw new Error('Failed');
    return res.json();
}
//# sourceMappingURL=users.api.js.map