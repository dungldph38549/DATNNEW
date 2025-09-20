// src/pages/Order.jsx
import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Table,
  Button,
  Tag,
  Spin,
  Input,
  Tooltip,
  Card,
  Pagination,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { getAllOrders, deleteOrderById } from "./../api/index";
import { ORDER_STATUS_LABELS } from "../const/index.ts";
import AdminOrderDetailPage from "./AdminOrderDetail.jsx";

export default function Order() {
  const queryClient = useQueryClient();
  const [orderSelected, setOrderSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => getAllOrders(page - 1, limit),
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá đơn hàng này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrderById({ id });
        queryClient.refetchQueries({ queryKey: ["admin-orders"] });
        Swal.fire("Đã xoá!", "Đơn hàng đã được xoá.", "success");
      } catch (err) {
        Swal.fire("Thất bại", "Không thể xoá đơn hàng.", "error");
      }
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => (
        <span className="text-green-600 font-semibold">
          {value.toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          pending: "gold",
          confirmed: "blue",
          shipped: "purple",
          delivered: "green",
          canceled: "red",
        };
        return (
          <Tag color={colorMap[status]}>
            {ORDER_STATUS_LABELS[status] || status}
          </Tag>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) => (
        <Tag color={paymentStatus === "paid" ? "green" : "red"}>
          {paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Xem / Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => setOrderSelected(record._id)}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (orderSelected) {
    return (
      <AdminOrderDetailPage
        id={orderSelected}
        onClose={() => setOrderSelected(null)}
      />
    );
  }

  return (
    <Card
      className="shadow rounded-xl"
      title={<h2 className="text-xl font-semibold">📦 Danh sách Đơn hàng</h2>}
      extra={
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo tên, email, mã đơn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Làm mới
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin tip="Đang tải danh sách đơn hàng..." size="large" />
        </div>
      ) : isError ? (
        <Empty description="Không thể tải dữ liệu" />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data.data
              ?.filter(
                (order) =>
                  order.fullName
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                  order.email?.toLowerCase().includes(search.toLowerCase()) ||
                  order._id?.toLowerCase().includes(search.toLowerCase())
              )
              .map((order) => ({
                ...order,
                key: order._id,
              }))}
            pagination={false}
            bordered
          />
          <div className="flex justify-center mt-4">
            <Pagination
              current={page}
              total={data.total}
              pageSize={limit}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </Card>
  );
}
