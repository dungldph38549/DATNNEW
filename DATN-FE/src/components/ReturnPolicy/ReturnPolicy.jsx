// import React from "react";
// import { Modal, Typography, List } from "antd";

// const { Title, Text } = Typography;

// const ReturnPolicy = ({ visible, onClose }) => {
//   const returnConditions = [
//     "Sản phẩm còn nguyên vẹn, chưa qua sử dụng",
//     "Còn đầy đủ bao bì, nhãn mác gốc",
//     "Trong thời hạn 7 ngày kể từ khi nhận hàng",
//     "Có hóa đơn mua hàng hợp lệ",
//     "Sản phẩm không thuộc danh mục không được đổi trả",
//   ];

//   const nonReturnableItems = [
//     "Sản phẩm đã qua sử dụng",
//     "Sản phẩm đã bị hư hỏng do lỗi người dùng",
//     "Sản phẩm thuộc danh mục đồ lót, mỹ phẩm",
//     "Sản phẩm được làm riêng theo yêu cầu",
//   ];

//   return (
//     <Modal
//       title="Chính sách đổi trả hàng"
//       open={visible}
//       onCancel={onClose}
//       footer={null}
//       width={600}
//     >
//       <div className="space-y-4">
//         <div>
//           <Title level={4}>Điều kiện đổi trả:</Title>
//           <List
//             size="small"
//             dataSource={returnConditions}
//             renderItem={(item, index) => (
//               <List.Item>
//                 <Text>
//                   {index + 1}. {item}
//                 </Text>
//               </List.Item>
//             )}
//           />
//         </div>

//         <div>
//           <Title level={4}>Sản phẩm không được đổi trả:</Title>
//           <List
//             size="small"
//             dataSource={nonReturnableItems}
//             renderItem={(item, index) => (
//               <List.Item>
//                 <Text type="secondary">
//                   {index + 1}. {item}
//                 </Text>
//               </List.Item>
//             )}
//           />
//         </div>

//         <div className="bg-blue-50 p-4 rounded">
//           <Title level={5} className="text-blue-800">
//             Lưu ý:
//           </Title>
//           <Text className="text-blue-700">
//             - Phí vận chuyển hoàn hàng sẽ do khách hàng chịu trách nhiệm
//             <br />
//             - Thời gian hoàn tiền: 1-3 ngày làm việc sau khi shop nhận hàng
//             <br />- Tiền sẽ được hoàn về tài khoản thanh toán gốc
//           </Text>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ReturnPolicy;
