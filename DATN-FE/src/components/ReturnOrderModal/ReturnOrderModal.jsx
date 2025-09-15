import React, { useState } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { RETURN_REASONS } from "../../constants/returnStatus";

const { TextArea } = Input;
const { Option } = Select;

const ReturnOrderModal = ({
  visible,
  onCancel,
  onSubmit,
  order,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (selectedItems.length === 0) {
        message.error("Vui lòng chọn ít nhất một sản phẩm để hoàn");
        return;
      }

      const formData = {
        orderId: order._id,
        items: selectedItems,
        reason: values.reason,
        description: values.description,
        images: fileList
          .map((file) => file.response?.url || file.url)
          .filter(Boolean),
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleItemToggle = (item, checked) => {
    if (checked) {
      setSelectedItems((prev) => [
        ...prev,
        {
          productId: item.productId._id,
          variantId: item.variantId,
          quantity: item.quantity,
          name: item.productId.name,
          price: item.price,
        },
      ]);
    } else {
      setSelectedItems((prev) =>
        prev.filter(
          (selected) =>
            selected.productId !== item.productId._id ||
            selected.variantId !== item.variantId
        )
      );
    }
  };

  const uploadProps = {
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Chỉ được tải lên file JPG/PNG!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Ảnh phải nhỏ hơn 5MB!");
        return false;
      }
      return true;
    },
    action: "/api/upload", // API endpoint upload ảnh
    multiple: true,
    maxCount: 5,
  };

  return (
    <Modal
      title="Yêu cầu hoàn hàng"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      okText="Gửi yêu cầu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Chọn sản phẩm muốn hoàn:">
          <div className="max-h-60 overflow-y-auto border rounded p-3">
            {order?.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border-b last:border-b-0"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3"
                    onChange={(e) => handleItemToggle(item, e.target.checked)}
                  />
                  <img
                    src={item.productId.images?.[0]}
                    alt={item.productId.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <div className="font-medium">{item.productId.name}</div>
                    <div className="text-sm text-gray-500">
                      Số lượng: {item.quantity} | Giá:{" "}
                      {item.price.toLocaleString()}₫
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Lý do hoàn hàng"
          rules={[{ required: true, message: "Vui lòng chọn lý do hoàn hàng" }]}
        >
          <Select placeholder="Chọn lý do hoàn hàng">
            {RETURN_REASONS.map((reason) => (
              <Option key={reason.value} value={reason.value}>
                {reason.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả chi tiết"
          rules={[
            { required: true, message: "Vui lòng mô tả chi tiết vấn đề" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết vấn đề với sản phẩm..."
          />
        </Form.Item>

        <Form.Item label="Hình ảnh minh chứng (nếu có)">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
          <div className="text-sm text-gray-500 mt-2">
            Tối đa 5 ảnh, mỗi ảnh nhỏ hơn 5MB
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReturnOrderModal;
