import { createBrowserRouter, Navigate } from "react-router-dom";
import PostList from "../Page/posts/PostList";
import PostForm from "../Page/posts/PostForm";
import PostDetail from "../Page/posts/PostDetail.tsx";

const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/list-post" replace /> },
    { path: "/list-post", element: <PostList /> },
    { path: "/post/new", element: <PostForm mode="create" /> },
    { path: "/post/:id/edit", element: <PostForm mode="edit" /> },
    { path: "/post/:id", element: <PostDetail /> },
    { path: "*", element: <div style={{ padding: 24 }}>Không tìm thấy trang</div> },
]);

export default router;