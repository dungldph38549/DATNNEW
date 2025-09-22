import React, { useState } from "react";
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
  Divider,
  Modal,
  InputNumber,
  List,
  Typography,
  Tag,
  Statistic,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  WalletOutlined,
  PlusOutlined,
  HistoryOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { updateCustomerById, uploadImage } from "../../api";
import { GET_IMAGE } from "../../const/index.ts";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "../../redux/user/index.js";

const { Text } = Typography;

export default function UserProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [rechargeForm] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [avatarPath, setAvatarPath] = useState(user.avatar || "");
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false);

  const [walletBalance, setWalletBalance] = useState(user.walletBalance || 0);
  const [walletHistory, setWalletHistory] = useState([
    {
      id: 1,
      type: "recharge",
      amount: 500000,
      description: "Nạp tiền vào ví",
      date: "2024-01-15 10:30:00",
      status: "completed",
    },
    {
      id: 2,
      type: "payment",
      amount: -150000,
      description: "Thanh toán đơn hàng #DH001",
      date: "2024-01-14 15:45:00",
      status: "completed",
    },
    {
      id: 3,
      type: "refund",
      amount: 75000,
      description: "Hoàn tiền đơn hàng #DH002",
      date: "2024-01-13 09:20:00",
      status: "completed",
    },
  ]);

  // Cập nhật thông tin user
  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (data) => updateCustomerById(data),
    onSuccess: (data) => {
      message.success("Cập nhật thành công");
      dispatch(
        updateUserInfo({
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          address: data.data.address,
          avatar: data.data.avatar,
        })
      );
      setIsEdit(false);
    },
    onError: () => {
      message.error("Lỗi khi cập nhật");
    },
  });

  // Mock nạp tiền
  const { mutate: rechargeWallet, isPending: isRecharging } = useMutation({
    mutationFn: async (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, newBalance: walletBalance + data.amount });
        }, 1500);
      });
    },
    onSuccess: (data, variables) => {
      const newTransaction = {
        id: Date.now(),
        type: "recharge",
        amount: variables.amount,
        description: `Nạp tiền vào ví - ${variables.method}`,
        date: new Date().toLocaleString("vi-VN"),
        status: "completed",
      };
      setWalletBalance(data.newBalance);
      setWalletHistory((prev) => [newTransaction, ...prev]);
      setIsRechargeModalVisible(false);
      rechargeForm.resetFields();
      message.success("Nạp tiền thành công!");
    },
    onError: () => {
      message.error("Nạp tiền thất bại!");
    },
  });

  const onEditInfo = (values) => {
    const payload = {
      ...values,
      avatar: values.avatar || avatarPath,
      id: user.id,
    };

    if (values.newPassword) {
      if (values.newPassword !== values.confirmPassword) {
        return message.error("Mật khẩu xác nhận không khớp!");
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
      formD.append("file", file);
      const res = await uploadImage(formD);
      const fullPath = res.path;
      form.setFieldsValue({ avatar: fullPath });
      setAvatarPath(fullPath);
      message.success("Tải ảnh thành công!");
    } catch (error) {
      message.error("Tải ảnh thất bại!");
    }
  };

  const handleRecharge = (values) => {
    rechargeWallet(values);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getTransactionColor = (type) => {
    switch (type) {
      case "recharge":
        return "green";
      case "payment":
        return "red";
      case "refund":
        return "blue";
      default:
        return "default";
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "recharge":
        return <PlusOutlined />;
      case "payment":
        return <CreditCardOutlined />;
      case "refund":
        return <HistoryOutlined />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Thông tin cá nhân */}
      <Card>
        <Row gutter={16}>
          <Col span={6} style={{ textAlign: "center" }}>
            <Avatar size={100} src={GET_IMAGE(avatarPath)} />
            <Upload showUploadList={false} customRequest={handleUploadFile}>
              <Button icon={<UploadOutlined />} style={{ marginTop: 10 }}>
                Đổi ảnh
              </Button>
            </Upload>
          </Col>

          <Col span={18}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
              }}
              onFinish={onEditInfo}
            >
              <Form.Item label="Tên" name="name">
                <Input disabled={!isEdit} />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input disabled={!isEdit} />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone">
                <Input disabled={!isEdit} />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address">
                <Input disabled={!isEdit} />
              </Form.Item>

              {isEdit && (
                <>
                  <Form.Item label="Mật khẩu mới" name="newPassword">
                    <Input.Password />
                  </Form.Item>
                  <Form.Item label="Xác nhận mật khẩu" name="confirmPassword">
                    <Input.Password />
                  </Form.Item>
                </>
              )}

              <Space>
                {isEdit ? (
                  <>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isPending}
                    >
                      Lưu
                    </Button>
                    <Button onClick={() => setIsEdit(false)}>Hủy</Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEdit(true)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Space>
            </Form>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Ví điện tử */}
      <Card
        title="Ví điện tử"
        extra={
          <Button
            type="primary"
            icon={<WalletOutlined />}
            onClick={() => setIsRechargeModalVisible(true)}
          >
            Nạp tiền
          </Button>
        }
      >
        <Statistic
          title="Số dư"
          value={walletBalance}
          formatter={(value) => formatCurrency(value)}
        />
        <List
          header={<div>Lịch sử giao dịch</div>}
          dataSource={walletHistory}
          renderItem={(item) => (
            <List.Item>
              <Tag color={getTransactionColor(item.type)}>
                {getTransactionIcon(item.type)} {item.type}
              </Tag>
              <Text>{item.description}</Text>
              <Text strong style={{ marginLeft: "auto" }}>
                {formatCurrency(item.amount)}
              </Text>
            </List.Item>
          )}
        />
      </Card>

      {/* Modal nạp tiền */}
      <Modal
        title="Nạp tiền"
        open={isRechargeModalVisible}
        onCancel={() => setIsRechargeModalVisible(false)}
        footer={null}
      >
        <Form form={rechargeForm} layout="vertical" onFinish={handleRecharge}>
          <Form.Item
            label="Số tiền"
            name="amount"
            rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
          >
            <InputNumber min={10000} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Phương thức"
            name="method"
            rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
          >
            <Input placeholder="VD: MoMo, ZaloPay, ..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isRecharging}>
            Xác nhận
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
