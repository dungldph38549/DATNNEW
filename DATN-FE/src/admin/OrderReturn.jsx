// src/pages/ReturnOrders.jsx
import { Table, Spin, Button, message, Tag, Space } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderReturn, acceptOrRejectReturn } from "../api/index";
import { ReloadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

export default function ReturnOrders() {
  const queryClient = useQueryClient();

  // Lấy danh sách yêu cầu hoàn hàng
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["return-orders"],
    queryFn: () => orderReturn(),
    keepPreviousData: true,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Chấp nhận / từ chối yêu cầu hoàn hàng
  const acceptOrRejectMutation = useMutation({
    mutationFn: ({ id, note, status }) =>
      acceptOrRejectReturn({ id, note, status }),
    onSuccess: (data, variables) => {
      const actionText =
        variables.status === "accepted" ? "chấp nhận" : "từ chối";
      message.success(`Đã ${actionText} yêu cầu hoàn hàng thành công`);
      queryClient.invalidateQueries({ queryKey: ["return-orders"] });
    },
    onError: (err) => {
      message.error(
        err?.response?.data?.message || "Lỗi khi cập nhật trạng thái"
      );
    },
  });

  // Làm mới dữ liệu
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["return-orders"] });
  };

  // Xử lý chấp nhận / từ chối
  const handleAcceptReject = async (id, status) => {
    if (acceptOrRejectMutation.isPending) return;

    const isReject = status === "rejected";

    const result = await Swal.fire({
      title: isReject
        ? "Xác nhận từ chối hoàn hàng"
        : "Xác nhận chấp nhận hoàn hàng",
      text: isReject
        ? "Hành động này sẽ từ chối yêu cầu hoàn hàng!"
        : "Bạn có chắc chắn muốn chấp nhận yêu cầu hoàn hàng này?",
      input: "textarea",
      inputPlaceholder: "Nhập ghi chú của bạn...",
      showCancelButton: true,
      confirmButtonText: isReject ? "Từ chối" : "Chấp nhận",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: isReject ? "#d33" : "#3085d6",
      inputAttributes: { maxlength: 500, rows: 4 },
      inputValidator: (value) => {
        if (!value?.trim()) {
          return "Vui lòng nhập ghi chú để tiếp tục!";
        }
        if (value.trim().length < 10) {
          return "Ghi chú phải có ít nhất 10 ký tự!";
        }
      },
    });

    if (result.isConfirmed) {
      acceptOrRejectMutation.mutate({
        id,
        note: result.value.trim(),
        status,
      });
    }
  };

  // Render trạng thái
  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { text: "Chờ xử lý", color: "processing" },
      accepted: { text: "Đã chấp nhận", color: "success" },
      rejected: { text: "Đã từ chối", color: "error" },
    };

    const config = statusConfig[status] || {
      text: "Không xác định",
      color: "default",
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Định nghĩa cột bảng
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      width: 150,
      render: (order) => (
        <span className="font-mono text-sm">{order?._id || "N/A"}</span>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 140,
      render: (img) =>
        img ? (
          <img
            src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${img}`}
            alt="Ảnh hoàn hàng"
            width={120}
            height="auto"
            className="object-cover rounded border"
            style={{ maxHeight: "80px" }}
            onError={(e) => {
              e.target.src = "/placeholder-image.png";
            }}
          />
        ) : (
          <div className="w-[120px] h-[80px] bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-xs">
            Không có ảnh
          </div>
        ),
    },
    {
      title: "Lý do hoàn hàng",
      dataIndex: "note",
      key: "note",
      render: (note) => (
        <div className="max-w-xs overflow-hidden text-ellipsis" title={note}>
          {note || "Không có lý do"}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      fixed: "right",
      render: (_, record) => {
        const isProcessing = acceptOrRejectMutation.isPending;

        if (record.status === "pending") {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                loading={isProcessing}
                disabled={isProcessing}
                onClick={() =>
                  handleAcceptReject(record.orderId?._id, "accepted")
                }
              >
                Đồng ý
              </Button>
              <Button
                danger
                size="small"
                loading={isProcessing}
                disabled={isProcessing}
                onClick={() =>
                  handleAcceptReject(record.orderId?._id, "rejected")
                }
              >
                Từ chối
              </Button>
            </Space>
          );
        }

        // Khi đã xử lý
        if (record.status === "accepted") {
          return <Tag color="success">Đã xử lý</Tag>;
        }
        if (record.status === "rejected") {
          return <Tag color="error">Đã từ chối</Tag>;
        }

        return <Tag color="default">Không xác định</Tag>;
      },
    },
  ];

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Đang tải danh sách yêu cầu hoàn hàng..." />
      </div>
    );
  }

  // Error
  if (isError || !data) {
    return (
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <div className="text-red-500 mb-4">
          <span className="text-lg">⚠️ Lỗi khi tải danh sách</span>
        </div>
        <p className="text-gray-600 mb-4">
          {error?.message || "Có lỗi xảy ra khi tải dữ liệu"}
        </p>
        <Button
          type="primary"
          onClick={handleRefresh}
          icon={<ReloadOutlined />}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  const tableData = Array.isArray(data)
    ? data.map((item) => ({
        ...item,
        key: item._id || Math.random().toString(),
        status: item.status || "pending", // đảm bảo luôn có trạng thái
      }))
    : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý yêu cầu hoàn hàng
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Tổng cộng: {tableData.length} yêu cầu
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          loading={isLoading}
          icon={<ReloadOutlined />}
          type="default"
        >
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={tableData}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} yêu cầu`,
        }}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <div className="py-8">
              <div className="text-gray-400 text-lg mb-2">📦</div>
              <div className="text-gray-500">
                Không có yêu cầu hoàn hàng nào
              </div>
            </div>
          ),
        }}
        rowClassName={(record) => {
          if (record.status === "accepted") return "bg-green-50";
          if (record.status === "rejected") return "bg-red-50";
          return "bg-yellow-50"; // pending
        }}
      />
    </div>
  );
}
