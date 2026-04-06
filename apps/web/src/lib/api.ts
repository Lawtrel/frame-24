import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/v1`
    : "http://localhost:4000/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
