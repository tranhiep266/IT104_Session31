import { useEffect, useState, useMemo } from "react";
import { Table, Button, Tag, Popconfirm, Input, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export interface Post {
    id: number;
    title: string;
    image: string;
    content: string;
    status: "published" | "draft";
    created_at: string;
}

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get<Post[]>("http://localhost:3000/posts");
            setPosts(res.data ?? []);
        } catch {
            message.error("Không tải được danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/posts/${id}`);
            message.success("Đã xóa bài viết");
        } catch {
            message.error("Xóa thất bại");
        } finally {
            fetchPosts();
        }
    };

    const onToggleStatus = async (record: Post) => {
        const newStatus = record.status === "published" ? "draft" : "published";
        try {
            await axios.patch(`http://localhost:3000/posts/${record.id}`, {
                status: newStatus,
            });
            message.success(
                newStatus === "draft" ? "Đã chặn bài viết" : "Đã bỏ chặn, xuất bản lại"
            );
        } catch (e: any) {
            if (axios.isAxiosError(e) && e.response?.status === 404) {
                message.warning(`Bài viết ID ${record.id} không tồn tại. Đang làm mới danh sách…`);
            } else {
                message.error("Đổi trạng thái thất bại");
            }
        } finally {
            fetchPosts();
        }
    };

    const filtered = useMemo(() => {
        if (!q.trim()) return posts;
        const k = q.toLowerCase();
        return posts.filter(
            (p) =>
                p.title.toLowerCase().includes(k) ||
                p.content.toLowerCase().includes(k) ||
                p.status.toLowerCase().includes(k)
        );
    }, [q, posts]);

    const columns: ColumnsType<Post> = [
        { title: "STT", render: (_: any, __: any, i: number) => i + 1, width: 70 },
        { title: "Tiêu đề", dataIndex: "title" },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            render: (url: string) => (
                <img
                    src={url}
                    width={60}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: 6 }}
                    alt=""
                />
            ),
            width: 100,
        },
        {
            title: "Ngày viết",
            dataIndex: "created_at",
            render: (d: string) =>
                new Date(d).toLocaleString("vi-VN", { hour12: false }),
            width: 200,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (s: Post["status"]) =>
                s === "published" ? (
                    <Tag color="green">Đã xuất bản</Tag>
                ) : (
                    <Tag color="red">Đã chặn</Tag>
                ),
            width: 140,
        },
        {
            title: "Chức năng",
            key: "action",
            render: (record: Post) => (
                <Space wrap>
                    <Button onClick={() => onToggleStatus(record)}>
                        {record.status === "published" ? "Chặn" : "Bỏ chặn"}
                    </Button>
                    <Button
                        onClick={() => navigate(`/post/${record.id}/edit`)}
                        type="dashed"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa bài viết"
                        description="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
            width: 280,
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 16 }}>Danh sách bài viết</h2>

            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    gap: 12,
                    justifyContent: "space-between",
                }}
            >
                <Input
                    placeholder="Tìm theo tiêu đề/nội dung/trạng thái…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    style={{ maxWidth: 360 }}
                    allowClear
                />
                <Link to="/post/new">
                    <Button type="primary">Thêm mới bài viết</Button>
                </Link>
            </div>

            <Table<Post>
                rowKey="id"
                columns={columns}
                dataSource={filtered}
                loading={loading}
                pagination={{ pageSize: 8, showTotal: (t) => `${t} bài` }}
            />
        </div>
    );
}