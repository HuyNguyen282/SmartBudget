// app/users/page.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export default function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => axiosInstance.get('/users').then(res => res.data),
  });

  if (isLoading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi!</p>;

  return (
    <ul>
      {data.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}