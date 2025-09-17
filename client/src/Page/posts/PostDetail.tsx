import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button, Tag, Space } from "antd";
import axios from "axios";
import type { Post } from "./PostList";

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        (async () => {
            if (!id) return;
            const res = await axios.get<Post>(`http://localhost:3000/posts/${id}`);
            setPost(res.data);
        })();
    }, [id]);

    if (!post) return <p style={{ padding: 24 }}>Đang tải...</p>;

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={post.title}
                extra={
                    <Space>
                        <Link to={`/post/${post.id}/edit`}>
                            <Button type="dashed">Sửa</Button>
                        </Link>
                        <Link to="/list-post">
                            <Button>Quay lại</Button>
                        </Link>
                    </Space>
                }
                style={{ maxWidth: 900, margin: "0 auto" }}
            >
                <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: 300, height: 180, objectFit: "cover", borderRadius: 8, marginBottom: 16 }}
                />
                <div style={{ marginBottom: 8 }}>
                    <b>Ngày viết:</b>{" "}
                    {new Date(post.created_at).toLocaleString("vi-VN", { hour12: false })}
                </div>
                <div style={{ marginBottom: 16 }}>
                    <b>Trạng thái:</b>{" "}
                    {post.status === "published" ? (
                        <Tag color="green">Đã xuất bản</Tag>
                    ) : (
                        <Tag color="red">Nháp</Tag>
                    )}
                </div>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{post.content}</p>
            </Card>
        </div>
    );
}