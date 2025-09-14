import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Upload,
  message,
  Space,
} from 'antd';
import {
  EditOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateCustomerById, uploadImage } from '../../api';
import { GET_IMAGE } from '../../const/index.ts';
import { useMutation } from '@tanstack/react-query';
import { updateUserInfo } from '../../redux/user/index.js';

export default function UserProfile() {
  
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [avatarPath, setAvatarPath] = useState(user.avatar || '');

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (data) => updateCustomerById(data),
    onSuccess: (data) => {
      message.success('Cập nhật thành công');
      dispatch(updateUserInfo({
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        address: data.data.address,
        avatar: data.data.avatar
      }));
      setIsEdit(false);
    },
    onError: () => {
      message.error('Lỗi khi cập nhật');
    },
  });

  const onEditInfo = (values) => {
    const payload = {
      ...values,
      avatar: values.avatar || avatarPath,
      id: user.id,
    };

    // Nếu có mật khẩu mới, kiểm tra khớp
    if (values.newPassword) {
      if (values.newPassword !== values.confirmPassword) {
        return message.error('Mật khẩu xác nhận không khớp!');
      }
      payload.password = values.newPassword;
    }

    delete payload.confirmPassword;
    delete payload.newPassword;

    updateUser(payload);
  };

  const handleUploadFile = async ({ file }) => {
    try {
      const formD = new FormData();
      formD.append('file', file);
      const res = await uploadImage(formD);
      const fullPath = res.path;
      form.setFieldsValue({ avatar: fullPath });
      setAvatarPath(fullPath);
      message.success('Tải ảnh thành công!');
    } catch (error) {
      message.error('Tải ảnh thất bại!');
    }
  };

  return (
    <Card title="Thông tin cá nhân" style={{ maxWidth: 700, margin: '0 auto' }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onEditInfo}
        initialValues={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          address: user.address,
        }}
      >
        <Row gutter={16}>
          <Col span={6} style={{ textAlign: 'center' }}>
            <Avatar size={100} src={avatarPath ? GET_IMAGE(avatarPath) : undefined} />
            <Upload
              showUploadList={false}
              customRequest={handleUploadFile}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} size="small" style={{ marginTop: 10 }}>
                Đổi ảnh
              </Button>
            </Upload>
          </Col>

          <Col span={18}>
            <Form.Item name="avatar" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="Họ tên" name="name">
              <Input disabled={!isEdit} />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Địa chỉ giao hàng"
              name="address"
            >
              <Input disabled={!isEdit} placeholder="Nhập địa chỉ" />
            </Form.Item>

            {isEdit && (
              <>
                <Form.Item label="Mật khẩu mới" name="newPassword">
                  <Input.Password placeholder="Để trống nếu không đổi" />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const newPassword = getFieldValue('newPassword');
                        if (!newPassword || newPassword === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>
              </>
            )}

            <Form.Item>
              {isEdit ? (
                <Space>
                  <Button type="primary" htmlType="submit" loading={isPending}>
                    Lưu thay đổi
                  </Button>
                  <Button onClick={() => setIsEdit(false)}>Huỷ</Button>
                </Space>
              ) : (
                <Button icon={<EditOutlined />} onClick={() => setIsEdit(true)}>
                  Chỉnh sửa thông tin
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
