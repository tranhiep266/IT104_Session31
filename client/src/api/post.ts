import axios from "axios";

const API = "http://localhost:3000/posts";

export const getPosts = () => axios.get(API);
export const createPost = (data: any) => axios.post(API, data);
export const updatePost = (id: number, data: any) => axios.put(`${API}/${id}`, data);
export const deletePost = (id: number) => axios.delete(`${API}/${id}`);
export const toggleStatus = (id: number, status: string) =>
    axios.patch(`${API}/${id}`, { status });