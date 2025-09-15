import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Row, Col, Typography, Divider, Button, message } from "antd";
import { ArrowLeftOutlined, TruckOutlined } from "@ant-design/icons";
import { getReturnRequestDetail, updateReturnShipping } from "../../api/index";
import ReturnStatus from "../../components/ReturnStatus/ReturnStatus";
import ReturnShippingModal from "../../components/ReturnShippingModal/ReturnShippingModal";
import { RETURN_STATUS } from "../../constants/returnStatus";

const { Title, Text } = Typography;

const ReturnOrderDetailPage = () => {
  const { returnId } = useParams();
  const queryClient = useQueryClient();
  const [shippingModalVisible, setShippingModalVisible] = useState(false);

  const { data: returnRequest, isLoading } = useQuery({
    queryKey: ["return-order-detail", returnId],
    queryFn: () => getReturnRequestDetail(returnId),
    enabled: !!returnId,
  });

  const updateShippingMutation = useMutation({
    mutationFn: updateReturnShipping,
    onSuccess: () => {
      message.success("Cập nhật thông tin vận chuyển thành công");
      queryClient.invalidateQueries({ queryKey: ["return-order-detail"] });
      setShippingModalVisible(false);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!returnRequest) return <div>Không tìm thấy yêu cầu hoàn hàng</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => window.history.back()}
        className="mb-4"
      >
        Quay lại
      </Button>

      <Title level={2}>
        Chi tiết yêu cầu hoàn hàng #{returnRequest._id.slice(-8)}
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <ReturnStatus returnRequest={returnRequest} />

          <Card title="Thông tin hoàn hàng" className="mb-4">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Lý do hoàn hàng:</Text>
                <div>{returnRequest.reason}</div>
              </Col>
              <Col span={12}>
                <Text strong>Số tiền hoàn:</Text>
                <div className="text-lg font-semibold text-green-600">
                  {returnRequest.refundAmount?.toLocaleString("vi-VN")}₫
                </div>
              </Col>
            </Row>

            <Divider />

            <div>
              <Text strong>Mô tả chi tiết:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                {returnRequest.description}
              </div>
            </div>

            {returnRequest.images?.length > 0 && (
              <>
                <Divider />
                <div>
                  <Text strong>Hình ảnh minh chứng:</Text>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {returnRequest.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card title="Sản phẩm hoàn">
            {returnRequest.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-3 border-b last:border-b-0"
              >
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.product?.name}</div>
                  <div className="text-sm text-gray-500">
                    Số lượng: {item.quantity} | Giá:{" "}
                    {item.price?.toLocaleString("vi-VN")}₫
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Thông tin vận chuyển">
            {returnRequest.trackingNumber ? (
              <div>
                <div className="mb-3">
                  <Text strong>Đơn vị vận chuyển:</Text>
                  <div>{returnRequest.shippingProvider}</div>
                </div>
                <div className="mb-3">
                  <Text strong>Mã vận đơn:</Text>
                  <div className="font-mono bg-gray-100 p-2 rounded">
                    {returnRequest.trackingNumber}
                  </div>
                </div>
              </div>
            ) : returnRequest.status === RETURN_STATUS.APPROVED ? (
              <div className="text-center">
                <div className="mb-4 text-gray-600">
                  Chưa cập nhật thông tin vận chuyển
                </div>
                <Button
                  type="primary"
                  icon={<TruckOutlined />}
                  onClick={() => setShippingModalVisible(true)}
                >
                  Cập nhật vận đơn
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Thông tin vận chuyển sẽ hiển thị khi yêu cầu được chấp nhận
              </div>
            )}

            <Divider />

            <div>
              <Text strong>Địa chỉ gửi hàng:</Text>
              <div className="mt-2 p-3 bg-blue-50 rounded text-sm">
                {returnRequest.returnAddress}
              </div>
            </div>
          </Card>

          <Card title="Đơn hàng gốc" className="mt-4">
            <div className="mb-2">
              <Text strong>Mã đơn hàng:</Text>
              <div className="font-mono">{returnRequest.order?._id}</div>
            </div>
            <div className="mb-2">
              <Text strong>Ngày đặt:</Text>
              <div>
                {new Date(returnRequest.order?.createdAt).toLocaleDateString(
                  "vi-VN"
                )}
              </div>
            </div>
            <div>
              <Text strong>Tổng tiền:</Text>
              <div className="font-semibold">
                {returnRequest.order?.totalAmount?.toLocaleString("vi-VN")}₫
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <ReturnShippingModal
        visible={shippingModalVisible}
        onCancel={() => setShippingModalVisible(false)}
        onSubmit={(data) => updateShippingMutation.mutate(data)}
        returnRequest={returnRequest}
        loading={updateShippingMutation.isLoading}
      />
    </div>
  );
};

export default ReturnOrderDetailPage;
