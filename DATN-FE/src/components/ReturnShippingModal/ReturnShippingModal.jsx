// import React from "react";
// import { Modal, Form, Input, Select, message } from "antd";

// const { Option } = Select;

// const SHIPPING_PROVIDERS = [
//   { value: "ghn", label: "Giao Hàng Nhanh" },
//   { value: "ghtk", label: "Giao Hàng Tiết Kiệm" },
//   { value: "viettel-post", label: "Viettel Post" },
//   { value: "vnpost", label: "Vietnam Post" },
//   { value: "j&t", label: "J&T Express" },
//   { value: "other", label: "Khác" },
// ];

// const ReturnShippingModal = ({
//   visible,
//   onCancel,
//   onSubmit,
//   returnRequest,
//   loading = false,
// }) => {
//   const [form] = Form.useForm();

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       await onSubmit({
//         returnId: returnRequest._id,
//         ...values,
//       });
//       form.resetFields();
//     } catch (error) {
//       console.error("Validation failed:", error);
//     }
//   };

//   return (
//     <Modal
//       title="Cập nhật thông tin gửi hàng"
//       open={visible}
//       onCancel={onCancel}
//       onOk={handleSubmit}
//       confirmLoading={loading}
//       okText="Cập nhật"
//       cancelText="Hủy"
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="shippingProvider"
//           label="Đơn vị vận chuyển"
//           rules={[
//             { required: true, message: "Vui lòng chọn đơn vị vận chuyển" },
//           ]}
//         >
//           <Select placeholder="Chọn đơn vị vận chuyển">
//             {SHIPPING_PROVIDERS.map((provider) => (
//               <Option key={provider.value} value={provider.value}>
//                 {provider.label}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="trackingNumber"
//           label="Mã vận đơn"
//           rules={[{ required: true, message: "Vui lòng nhập mã vận đơn" }]}
//         >
//           <Input placeholder="Nhập mã vận đơn..." />
//         </Form.Item>

//         <div className="bg-gray-50 p-3 rounded mb-4">
//           <div className="font-medium mb-2">Địa chỉ gửi hàng:</div>
//           <div className="text-sm">{returnRequest.returnAddress}</div>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default ReturnShippingModal;
