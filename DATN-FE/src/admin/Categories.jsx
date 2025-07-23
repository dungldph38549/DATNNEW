import React, { useState } from 'react';
import {
  Table, Tag, Spin, Modal, Button, Form,
  Input, message, Switch
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllCategories,
  updateCategory,
  createCategory,
  uploadImage
} from '../api/index';

export default function Categories() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [createImagePreview, setCreateImagePreview] = useState('');

  const [form] = Form.useForm(); // Edit form
  const [createForm] = Form.useForm(); // Create form

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => getAllCategories('all'),
    keepPreviousData: true,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory({ id, ...data }),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsEditModalVisible(false);
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    },
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      message.success('Tạo thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsCreateModalVisible(false);
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi tạo mới');
    },
  });

  const transformFormValues = (values) => ({
    ...values,
    status: values.status ? 'active' : 'inactive',
  });

  const handleUpdateSubmit = (values) => {
    updateMutation.mutate({
      id: selected._id,
      data: transformFormValues(values),
    });
  };

  const handleCreateSubmit = (values) => {
    createMutation.mutate(transformFormValues(values));
  };

  const handleEdit = (record) => {
    setSelected(record);
    setImagePreview(record.image);
    form.setFieldsValue({
      name: record.name,
      image: record.image,
      status: record.status === 'active',
    });
    setIsEditModalVisible(true);
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (img) => img && (
        <img
          src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${img}`}
          alt="Ảnh"
          className="w-12 h-12 object-cover rounded"
        />
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <Tag color={s === 'active' ? 'green' : 'red'}>
          {s}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) =>
        new Date(date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
      ),
    },
  ];

  // ========================== Edit Form ==========================
  const renderEditForm = () => {
    const handleChangeImg = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await uploadImage(formData);
        form.setFieldsValue({ image: result.path });
        setImagePreview(result.path);
        message.success('Tải ảnh thành công');
      } catch (err) {
        message.error('Upload ảnh thất bại');
      }
    };

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateSubmit}
      >
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="image" noStyle>
          <input type="hidden" />
        </Form.Item>

        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Chọn ảnh
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif"
              onChange={handleChangeImg}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <img
              src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${imagePreview}`}
              alt="Preview"
              className="w-20 h-20 object-cover rounded border border-gray-300 shadow"
            />
          )}
        </div>

        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    );
  };

  // ========================== Create Form ==========================
  const renderCreateForm = () => {
    const handleChangeImg = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await uploadImage(formData);
        createForm.setFieldsValue({ image: result.path });
        setCreateImagePreview(result.path);
        message.success('Tải ảnh thành công');
      } catch (err) {
        message.error('Upload ảnh thất bại');
      }
    };

    return (
      <Form
        form={createForm}
        layout="vertical"
        initialValues={{ name: '', image: '', status: true }}
        onFinish={handleCreateSubmit}
      >
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="image" noStyle>
          <input type="hidden" />
        </Form.Item>

        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Chọn ảnh
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif"
              onChange={handleChangeImg}
              className="hidden"
            />
          </label>

          {createImagePreview && (
            <img
              src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${createImagePreview}`}
              alt="Preview"
              className="w-20 h-20 object-cover rounded border border-gray-300 shadow"
            />
          )}
        </div>

        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    );
  };

  if (isLoading) {
    return <Spin tip="Đang tải danh sách ..." className="mt-10 block text-center" />;
  }

  if (isError || !data) {
    return <div className="text-center text-red-500">Lỗi khi tải danh sách.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Danh sách</h2>
        <Button
          type="primary"
          onClick={() => {
            setCreateImagePreview('');
            createForm.resetFields();
            setIsCreateModalVisible(true);
          }}
        >
          + Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data.data.map((v) => ({ ...v, key: v._id }))}
        bordered
        pagination={false}
      />

      <Modal
        title="Chỉnh sửa"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {selected && renderEditForm()}
      </Modal>

      <Modal
        title="Tạo mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {renderCreateForm()}
      </Modal>
    </div>
  );
}
