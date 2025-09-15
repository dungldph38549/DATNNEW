import React, { useState } from "react";
import {
  Table,
  Tag,
  Spin,
  Modal,
  Button,
  Form,
  Input,
  message,
  Switch,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUser, updateUserById } from "../api/index";

const Users = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-user", page],
    queryFn: () => getAllUser(page - 1, limit), // backend tính từ 0
    keepPreviousData: true,
  });

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: ({ id, data }) => updateUserById(id, data),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
      setIsModalVisible(false);
    },
    onError: () => {
      message.error("Lỗi khi cập nhật");
    },
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalOk = (values) => {
    updateUser({
      id: selectedUser._id,
      data: {
        password: values.password,
        isAdmin: values.isAdmin,
      },
    });
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Quyền",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin) =>
        isAdmin ? <Tag color="green">Admin</Tag> : <Tag color="blue">User</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  if (isLoading)
    return (
      <Spin
        tip="Đang tải danh sách người dùng..."
        className="mt-10 block text-center"
      />
    );
  if (isError || !data)
    return (
      <div className="text-center text-red-500">
        Lỗi khi tải danh sách người dùng.
      </div>
    );

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Danh sách người dùng</h2>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data.data.map((user) => ({ ...user, key: user._id }))}
          pagination={{
            current: page,
            total: data.total,
            pageSize: limit,
            onChange: (newPage) => setPage(newPage),
          }}
          bordered
          rowKey="_id"
        />
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {selectedUser && (
          <Form
            layout="vertical"
            initialValues={{
              isAdmin: selectedUser.isAdmin,
              password: "",
            }}
            onFinish={handleModalOk}
          >
            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[{ message: "Nhập mật khẩu mới" }]}
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Quyền admin"
              name="isAdmin"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isPending}>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Users;
