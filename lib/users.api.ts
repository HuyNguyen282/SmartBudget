// lib/api/users.api.ts
export async function getUsers() {
  const res = await fetch(`${process.env.API_URL}/users`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}