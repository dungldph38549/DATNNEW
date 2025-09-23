import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getUserOrders, getOrderById } from "../../api/index.js";
import {
  GET_IMAGE,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD,
} from "../../const/index.ts";
import { Tag, Modal } from "antd";
import dayjs from "dayjs";

const SHIPPING_METHOD = {
  fast: "Giao nhanh",
  standard: "Tiêu chuẩn",
};

const OrderHistoryPage = () => {
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const user = useSelector((state) => state.auth.user); // Giả sử user được lưu trong Redux

  // Fetch danh sách đơn hàng
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["user-orders", page, statusFilter, user?.id],
    queryFn: () =>
      getUserOrders({
        page,
        limit: 10,
        status: statusFilter,
        userId: user?.id,
      }),
    enabled: !!user?.id,
    keepPreviousData: true,
  });

  // Fetch chi tiết đơn hàng khi mở modal
  const { data: orderDetailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["order-detail", selectedOrderId],
    queryFn: () => getOrderById(selectedOrderId),
    enabled: !!selectedOrderId,
  });

  useEffect(() => {
    setPage(0);
    setOrders([]);
  }, [statusFilter]);

  useEffect(() => {
    if (ordersData?.data) {
      setOrders((prev) => {
        if (page === 0) return ordersData.data;
        const existingIds = new Set(prev.map((o) => o._id));
        const newData = ordersData.data.filter((o) => !existingIds.has(o._id));
        return [...prev, ...newData];
      });
    }
  }, [ordersData, page]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleViewDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
    setIsDetailModalOpen(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "gold",
      confirmed: "blue",
      shipped: "purple",
      delivered: "green",
      canceled: "red",
      "return-request": "orange",
      accepted: "cyan",
      rejected: "magenta",
    };
    return colors[status] || "default";
  };

  const orderStatuses = [
    { value: "", label: "Tất cả đơn hàng" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "shipped", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
    { value: "canceled", label: "Đã hủy" },
  ];

  const { order: orderDetail } = orderDetailData || {};

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Lịch sử mua hàng
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filter */}
          <aside className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold text-lg mb-4">Lọc theo trạng thái</h2>
              <ul className="space-y-2">
                {orderStatuses.map((status) => (
                  <li
                    key={status.value}
                    onClick={() => setStatusFilter(status.value)}
                    className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                      statusFilter === status.value
                        ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {status.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <section className="md:col-span-3">
            {isLoading && page === 0 && (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}

            {orders.length === 0 && !isLoading && (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
              </div>
            )}

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Đơn hàng #{order._id?.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                        </p>
                      </div>
                      <div className="text-right">
                        <Tag
                          color={getStatusColor(order.status)}
                          className="mb-2"
                        >
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </Tag>
                        <div>
                          <span className="text-sm text-gray-500">
                            Tổng tiền:{" "}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {order.totalAmount?.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4">
                    <div className="grid gap-3">
                      {order.products?.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded"
                        >
                          <img
                            src={GET_IMAGE(item.productId?.image)}
                            alt={item.productId?.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {item.productId?.name}
                            </h4>
                            <div className="mt-1">
                              {Object.entries(item.attributes || {}).map(
                                ([key, value]) => (
                                  <Tag
                                    key={key}
                                    size="small"
                                    color="blue"
                                    className="mr-1"
                                  >
                                    {key}: {value}
                                  </Tag>
                                )
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-500">
                                Số lượng: {item.quantity}
                              </span>
                              <span className="font-semibold text-blue-600">
                                {item.price?.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {order.products?.length > 2 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          ... và {order.products.length - 2} sản phẩm khác
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <div className="text-sm text-gray-600">
                        <span>Phương thức thanh toán: </span>
                        <span className="font-medium">
                          {PAYMENT_METHOD[order.paymentMethod]}
                        </span>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleViewDetail(order._id)}
                          className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                        >
                          Xem chi tiết
                        </button>
                        {order.status === "delivered" && (
                          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Mua lại
                          </button>
                        )}
                        {order.status === "pending" && (
                          <button className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                            Hủy đơn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {(ordersData?.pageCurrent ?? 0) < (ordersData?.totalPage ?? 0) && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Đang tải..." : "Xem thêm đơn hàng"}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Order Detail Modal */}
        <Modal
          title="Chi tiết đơn hàng"
          open={isDetailModalOpen}
          onCancel={handleCloseDetail}
          footer={null}
          width={800}
          className="order-detail-modal"
        >
          {isDetailLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Đang tải chi tiết...</p>
            </div>
          ) : orderDetail ? (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Thông tin người nhận</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Họ tên:</strong> {orderDetail.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {orderDetail.email}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {orderDetail.phone}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {orderDetail.address}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Mã đơn:</strong> {orderDetail._id}
                    </p>
                    <p>
                      <strong>Ngày đặt:</strong>{" "}
                      {dayjs(orderDetail.createdAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>
                      <Tag
                        color={getStatusColor(orderDetail.status)}
                        className="ml-2"
                      >
                        {ORDER_STATUS_LABELS[orderDetail.status]}
                      </Tag>
                    </p>
                    <p>
                      <strong>Phương thức giao hàng:</strong>{" "}
                      {SHIPPING_METHOD[orderDetail.shippingMethod]}
                    </p>
                    <p>
                      <strong>Phương thức thanh toán:</strong>{" "}
                      {PAYMENT_METHOD[orderDetail.paymentMethod]}
                    </p>
                    <p>
                      <strong>Trạng thái thanh toán:</strong>
                      <Tag
                        color={
                          orderDetail.paymentStatus === "paid" ? "green" : "red"
                        }
                        className="ml-2"
                      >
                        {orderDetail.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </Tag>
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold mb-3">Danh sách sản phẩm</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 grid grid-cols-5 gap-4 p-3 text-sm font-medium text-gray-700">
                    <span>Ảnh</span>
                    <span>Tên sản phẩm</span>
                    <span>Giá</span>
                    <span>Số lượng</span>
                    <span>Thành tiền</span>
                  </div>
                  {orderDetail.products?.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 p-3 border-t items-center"
                    >
                      <img
                        src={GET_IMAGE(item.productId?.image)}
                        alt={item.productId?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium line-clamp-2">
                          {item.productId?.name}
                        </p>
                        <div className="mt-1">
                          {Object.entries(item.attributes || {}).map(
                            ([key, value]) => (
                              <Tag key={key} size="small" color="blue">
                                {key}: {value}
                              </Tag>
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-sm">
                        {item.price?.toLocaleString("vi-VN")}₫
                      </p>
                      <p className="text-sm">{item.quantity}</p>
                      <p className="text-sm font-medium">
                        {(item.quantity * item.price)?.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 text-right border-t pt-4">
                <div className="flex justify-between">
                  <span>Phí ship:</span>
                  <span className="font-medium">
                    {orderDetail.shippingFee?.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span className="font-medium text-red-600">
                    -{orderDetail.discount?.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {orderDetail.totalAmount?.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-red-500 py-8">
              Không tìm thấy thông tin đơn hàng
            </p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
