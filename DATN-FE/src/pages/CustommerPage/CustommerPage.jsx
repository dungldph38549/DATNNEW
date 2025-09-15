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

const { Title, Text } = Typography;

export default function UserProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [rechargeForm] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [avatarPath, setAvatarPath] = useState(user.avatar || "");
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  // Mock data cho ví điện tử - trong thực tế sẽ lấy từ API
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

  // API call cho nạp tiền - mock function
  const { mutate: rechargeWallet, isPending: isRecharging } = useMutation({
    mutationFn: async (data) => {
      // Mock API call - thay thế bằng API thực tế
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
      {/* Ví điện tử */}
      <Card
        title={
          <Space>
            <WalletOutlined />
            <span>Ví điện tử</span>
          </Space>
        }
        style={{ marginBottom: 20 }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsRechargeModalVisible(true)}
            >
              Nạp tiền
            </Button>
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setIsHistoryModalVisible(true)}
            >
              Lịch sử
            </Button>
          </Space>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Số dư hiện tại"
              value={walletBalance}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Tổng giao dịch"
              value={walletHistory.length}
              suffix="giao dịch"
            />
          </Col>
        </Row>
      </Card>

      {/* Thông tin cá nhân */}
      <Card title="Thông tin cá nhân">
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
            <Col span={6} style={{ textAlign: "center" }}>
              <Avatar
                size={100}
                src={avatarPath ? GET_IMAGE(avatarPath) : undefined}
              />
              <Upload
                showUploadList={false}
                customRequest={handleUploadFile}
                accept="image/*"
              >
                <Button
                  icon={<UploadOutlined />}
                  size="small"
                  style={{ marginTop: 10 }}
                >
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

              <Form.Item label="Địa chỉ giao hàng" name="address">
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
                    dependencies={["newPassword"]}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const newPassword = getFieldValue("newPassword");
                          if (!newPassword || newPassword === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Mật khẩu không khớp!")
                          );
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isPending}
                    >
                      Lưu thay đổi
                    </Button>
                    <Button onClick={() => setIsEdit(false)}>Huỷ</Button>
                  </Space>
                ) : (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEdit(true)}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Modal nạp tiền */}
      <Modal
        title="Nạp tiền vào ví"
        open={isRechargeModalVisible}
        onCancel={() => setIsRechargeModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={rechargeForm} layout="vertical" onFinish={handleRecharge}>
          <Form.Item
            label="Số tiền nạp"
            name="amount"
            rules={[
              { required: true, message: "Vui lòng nhập số tiền!" },
              {
                type: "number",
                min: 10000,
                message: "Số tiền tối thiểu 10,000 VNĐ",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập số tiền"
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item
            label="Phương thức thanh toán"
            name="method"
            rules={[{ required: true, message: "Vui lòng chọn phương thức!" }]}
          >
            <Input placeholder="VD: Thẻ ngân hàng, Ví MoMo, ZaloPay..." />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsRechargeModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={isRecharging}>
                Nạp tiền
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Divider />
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f6f6f6",
            borderRadius: "6px",
          }}
        >
          <Text type="secondary" style={{ fontSize: "12px" }}>
            💡 <strong>Lưu ý:</strong> Số tiền nạp tối thiểu là 10,000 VNĐ. Giao
            dịch sẽ được xử lý ngay lập tức sau khi xác nhận.
          </Text>
        </div>
      </Modal>

      {/* Modal lịch sử giao dịch */}
      <Modal
        title="Lịch sử giao dịch"
        open={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsHistoryModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        <List
          dataSource={walletHistory}
          renderItem={(transaction) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: `${getTransactionColor(
                        transaction.type
                      )}1A`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        getTransactionColor(transaction.type) === "red"
                          ? "#ff4d4f"
                          : getTransactionColor(transaction.type) === "green"
                          ? "#52c41a"
                          : "#1890ff",
                    }}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>
                }
                title={
                  <Space>
                    <span>{transaction.description}</span>
                    <Tag color={getTransactionColor(transaction.type)}>
                      {transaction.type === "recharge"
                        ? "Nạp tiền"
                        : transaction.type === "payment"
                        ? "Thanh toán"
                        : "Hoàn tiền"}
                    </Tag>
                  </Space>
                }
                description={transaction.date}
              />
              <div style={{ textAlign: "right" }}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: transaction.amount > 0 ? "#52c41a" : "#ff4d4f",
                  }}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </Text>
                <br />
                <Tag color="green" size="small">
                  {transaction.status === "completed"
                    ? "Hoàn thành"
                    : "Đang xử lý"}
                </Tag>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}
