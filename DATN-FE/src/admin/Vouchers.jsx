import React, { useState } from 'react';
import {
  Table, Tag, Spin, Modal, Button, Form,
  Input, message, Switch, DatePicker, InputNumber, Select
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVouchers, updateVoucher, createVoucher } from '../api/index';
import dayjs from 'dayjs';

const { Option } = Select;

const Vouchers = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-voucher', page],
    queryFn: () => getAllVouchers({ page, limit }),
    keepPreviousData: true,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateVoucher({ id, ...data }),
    onSuccess: () => {
      message.success('Cập nhật voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-voucher'] });
      setIsEditModalVisible(false);
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createVoucher(data),
    onSuccess: () => {
      message.success('Tạo voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-voucher'] });
      setIsCreateModalVisible(false);
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi tạo voucher');
    },
  });

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setIsEditModalVisible(true);
  };

  const transformFormValues = (values) => ({
    ...values,
    startDate: values.dateRange[0].toISOString(),
    endDate: values.dateRange[1].toISOString(),
    status: values.status ? 'active' : 'inactive',
  });

  const handleUpdateSubmit = (values) => {
    updateMutation.mutate({
      id: selectedVoucher._id,
      data: transformFormValues(values),
    });
  };

  const handleCreateSubmit = (values) => {
    createMutation.mutate(transformFormValues(values));
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Mã', dataIndex: 'code', key: 'code' },
    { title: 'Giảm', dataIndex: 'value', key: 'value' },
    {
      title: 'Loại', dataIndex: 'type', key: 'type',
      render: (type) => type === 'percentage' ? 'Phần trăm' : 'Cố định'
    },
    { title: 'Số lượng', dataIndex: 'count', key: 'count' },
    { title: 'Đã dùng', dataIndex: 'usedCount', key: 'usedCount' },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>
    },
    {
      title: 'Bắt đầu', dataIndex: 'startDate', key: 'startDate',
      render: (d) => new Date(d).toLocaleDateString('vi-VN')
    },
    {
      title: 'Kết thúc', dataIndex: 'endDate', key: 'endDate',
      render: (d) => new Date(d).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
      ),
    },
  ];

  const renderForm = (initialValues = {}, onFinish, loading = false) => {
    console.log('1', dayjs(initialValues.startDate), dayjs(initialValues.endDate));

    return (
      <Form
        layout="vertical"
        initialValues={{
          name: initialValues.name || '',
          code: initialValues.code || '',
          value: initialValues.value || 0,
          type: initialValues.type || 'percentage',
          dateRange: initialValues.startDate && initialValues.endDate
            ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
            : undefined,
          count: initialValues.count || 0,
          status: initialValues.status === 'active',
        }}
        onFinish={onFinish}
      >
        <Form.Item label="Tên voucher" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mã voucher" name="code" rules={[{ required: true }]}>
          <Input disabled={!!initialValues.code} />
        </Form.Item>
        <Form.Item label="Giá trị giảm" name="value" rules={[{ required: true }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item label="Loại giảm" name="type" rules={[{ required: true }]}>
          <Select>
            <Option value="percentage">Phần trăm</Option>
            <Option value="fixed">Cố định</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Khoảng thời gian" name="dateRange" rules={[{ required: true }]}>
          <DatePicker.RangePicker className="w-full" />
        </Form.Item>
        <Form.Item label="Số lượng" name="count">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    );
  };

  if (isLoading)
    return <Spin tip="Đang tải danh sách voucher..." className="mt-10 block text-center" />;

  if (isError || !data)
    return <div className="text-center text-red-500">Lỗi khi tải danh sách voucher.</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Danh sách voucher</h2>
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          + Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data.data.map((v) => ({ ...v, key: v._id }))}
        pagination={{
          current: page,
          total: data.total,
          pageSize: limit,
          onChange: (newPage) => setPage(newPage),
        }}
        bordered
      />

      <Modal
        title="Chỉnh sửa voucher"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {selectedVoucher &&
          renderForm(selectedVoucher, handleUpdateSubmit, updateMutation.isPending)}
      </Modal>

      <Modal
        title="Tạo mới voucher"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {renderForm({}, handleCreateSubmit, createMutation.isPending)}
      </Modal>
    </div>
  );
};

export default Vouchers;
