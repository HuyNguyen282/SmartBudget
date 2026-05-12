'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
export default function Test() {
  useEffect(() => {
    axiosInstance.get("/")
      .then(res => console.log("DATA:", res.data))
      .catch(err => console.error("ERROR:", err));
  }, []);

  return <div>Test API</div>;
}
