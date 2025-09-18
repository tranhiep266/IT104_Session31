import { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Post } from "./PostList";

type Mode = "create" | "edit";
export default function PostForm({ mode = "create" as Mode }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm<Post>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (mode === "edit" && id) {
                try {
                    const res = await axios.get<Post>(`http://localhost:3000/posts/${id}`);
                    form.setFieldsValue(res.data);
                } catch {
                    message.error("Không tải được bài viết");
                }
            } else {
                form.setFieldsValue({
                    title: "",
                    image: "",
                    content: "",
                    status: "draft",
                    created_at: new Date().toISOString(),
                } as Post);
            }
        };
        load();
    }, [id, mode, form]);

    const onSubmit = async (values: Post) => {
        setLoading(true);
        try {
            if (mode === "create") {
                const payload = {
                    ...values,
                    created_at: values?.created_at || new Date().toISOString(),
                };
                await axios.post("http://localhost:3000/posts", payload);
                message.success("Đã tạo bài viết");
            } else {
                await axios.put(`http://localhost:3000/posts/${id}`, values);
                message.success("Đã cập nhật bài viết");
            }
            navigate("/list-post");
        } catch {
            message.error("Lưu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={mode === "create" ? "Thêm mới bài viết" : "Chỉnh sửa bài viết"}
                style={{ maxWidth: 800, margin: "0 auto" }}
            >
                <Form<Post> form={form} layout="vertical" onFinish={onSubmit}>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="URL hình ảnh"
                        rules={[
                            { required: true, message: "Nhập URL hình ảnh" },
                            { type: "url" as const, message: "URL không hợp lệ" },
                        ]}
                    >
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: "Nhập nội dung" }]}>
                        <Input.TextArea rows={6} placeholder="Nội dung bài viết" />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: "published", label: "Đã xuất bản" },
                                { value: "draft", label: "Nháp" },
                            ]}
                        />
                    </Form.Item>

                    {/* Ẩn nhưng vẫn giữ giá trị ngày tạo */}
                    <Form.Item name="created_at" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {mode === "create" ? "Tạo bài viết" : "Lưu thay đổi"}
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}