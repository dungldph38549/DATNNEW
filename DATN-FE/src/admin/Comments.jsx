// src/pages/admin/Comments.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Rate,
  Avatar,
  Tag,
  Space,
  message,
  Spin,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  MessageOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  StarFilled,
  CommentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getReviewById, repliesReview, getAllProducts } from "../api/index";

const { TextArea } = Input;
const { Option } = Select;

export default function Comments() {
  const queryClient = useQueryClient();

  // Local states
  const [selectedProductId, setSelectedProductId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch products for dropdown
  const { data: productsData } = useQuery({
    queryKey: ["products-for-reviews"],
    queryFn: () =>
      getAllProducts({
        page: 1,
        limit: 1000,
        isListProductRemoved: false,
        filter: {},
      }),
    staleTime: 10 * 60 * 1000,
  });

  const allProducts = productsData?.data || [];

  // Fetch reviews
  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews", selectedProductId],
    queryFn: async () => {
      if (selectedProductId) {
        // Get reviews for specific product
        const reviewsData = await getReviewById(selectedProductId);
        const reviews = reviewsData?.data || [];

        const selectedProduct = allProducts.find(
          (p) => p._id === selectedProductId
        );
        return reviews.map((review) => ({
          ...review,
          product: {
            _id: selectedProduct?._id,
            name: selectedProduct?.name,
            image: selectedProduct?.images?.[0] || selectedProduct?.image,
          },
        }));
      } else {
        // Get reviews for all products (limited)
        const products = allProducts.slice(0, 15);
        const allReviews = [];

        for (const product of products) {
          try {
            const reviewsData = await getReviewById(product._id);
            if (reviewsData?.data && Array.isArray(reviewsData.data)) {
              const reviewsWithProduct = reviewsData.data.map((review) => ({
                ...review,
                product: {
                  _id: product._id,
                  name: product.name,
                  image: product.images?.[0] || product.image,
                },
              }));
              allReviews.push(...reviewsWithProduct);
            }
          } catch (error) {
            console.warn(`Error fetching reviews for product ${product._id}`);
          }
        }

        return allReviews;
      }
    },
    enabled: !!allProducts.length,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ reviewId, content }) => repliesReview({ reviewId, content }),
    onSuccess: () => {
      message.success("Đã trả lời đánh giá thành công");
      setReplyModalVisible(false);
      setReplyText("");
      setSelectedReview(null);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || "Lỗi khi trả lời đánh giá");
    },
  });

  // Handlers
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyModalVisible(true);
    setReplyText("");
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      message.warning("Vui lòng nhập nội dung trả lời");
      return;
    }

    if (replyText.trim().length < 10) {
      message.warning("Nội dung trả lời phải có ít nhất 10 ký tự");
      return;
    }

    replyMutation.mutate({
      reviewId: selectedReview._id,
      content: replyText.trim(),
    });
  };

  const getRatingTag = (rating) => {
    if (rating >= 4)
      return (
        <Tag color="success" icon={<StarFilled />}>
          Tích cực
        </Tag>
      );
    if (rating >= 3)
      return (
        <Tag color="warning" icon={<StarFilled />}>
          Trung bình
        </Tag>
      );
    return (
      <Tag color="error" icon={<StarFilled />}>
        Tiêu cực
      </Tag>
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${process.env.REACT_APP_API_URL_BACKEND}/image/${imagePath}`;
  };

  // Prepare table data
  const reviews = reviewsData || [];
  const filteredReviews = reviews
    .filter((review) => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return (
        review.comment?.toLowerCase().includes(searchLower) ||
        review.userId?.name?.toLowerCase().includes(searchLower) ||
        review.userId?.username?.toLowerCase().includes(searchLower) ||
        review.product?.name?.toLowerCase().includes(searchLower)
      );
    })
    .map((review) => ({ ...review, key: review._id }));

  // Statistics
  const totalReviews = filteredReviews.length;
  const positiveReviews = filteredReviews.filter((r) => r.rating >= 4).length;
  const neutralReviews = filteredReviews.filter((r) => r.rating === 3).length;
  const negativeReviews = filteredReviews.filter((r) => r.rating <= 2).length;
  const repliedReviews = filteredReviews.filter(
    (r) => r.replies && r.replies.length > 0
  ).length;

  // Table columns
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "userId",
      key: "userId",
      width: 150,
      render: (user) => (
        <div className="flex items-center space-x-2">
          <Avatar
            size={32}
            src={getImageUrl(user?.avatar)}
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-medium text-sm">
              {user?.name || user?.username || "Ẩn danh"}
            </div>
            <div className="text-xs text-gray-500">{user?.email || ""}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      width: 200,
      render: (product) => (
        <div className="flex items-center space-x-2">
          {product?.image && (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-8 h-8 object-cover rounded"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div>
            <div className="font-medium text-sm line-clamp-2">
              {product?.name || "Sản phẩm đã xóa"}
            </div>
            <div className="text-xs text-gray-500">
              ID: {product?._id?.slice(-8) || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      render: (comment, record) => (
        <div className="max-w-xs">
          <div className="flex items-center mb-1">
            <Rate disabled defaultValue={record.rating || 0} size="small" />
            <span className="ml-2 text-sm text-gray-500">
              ({record.rating || 0}/5)
            </span>
          </div>
          <div
            className="text-sm line-clamp-3 cursor-pointer hover:text-blue-600"
            title={comment}
            onClick={() => {
              Modal.info({
                title: "Chi tiết đánh giá",
                content: (
                  <div>
                    <div className="mb-3">
                      <Rate disabled defaultValue={record.rating || 0} />
                      <span className="ml-2">({record.rating || 0}/5)</span>
                    </div>
                    <p className="whitespace-pre-wrap mb-4">{comment}</p>
                    {record.replies && record.replies.length > 0 && (
                      <div>
                        <div className="font-medium text-gray-800 mb-2">
                          Phản hồi từ Admin ({record.replies.length}):
                        </div>
                        {record.replies.map((reply, index) => (
                          <div
                            key={index}
                            className="mb-2 p-3 bg-blue-50 rounded border-l-4 border-blue-400"
                          >
                            <p className="text-blue-700">{reply.content}</p>
                            <div className="text-xs text-blue-500 mt-1">
                              {new Date(reply.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
                width: 600,
              });
            }}
          >
            {comment || "Không có nội dung"}
          </div>
          {record.replies && record.replies.length > 0 && (
            <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              ✓ Đã trả lời ({record.replies.length})
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => getRatingTag(rating),
      filters: [
        { text: "5 sao", value: 5 },
        { text: "4 sao", value: 4 },
        { text: "3 sao", value: 3 },
        { text: "2 sao", value: 2 },
        { text: "1 sao", value: 1 },
      ],
      onFilter: (value, record) => record.rating === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button
          size="small"
          type="primary"
          icon={<MessageOutlined />}
          loading={replyMutation.isPending}
          disabled={replyMutation.isPending}
          onClick={() => handleReply(record)}
        >
          Trả lời
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" tip="Đang tải danh sách đánh giá..." />
        </div>
      </div>
    );
  }

  if (isError && !reviews.length) {
    return (
      <div className="p-6">
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
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng đánh giá"
              value={totalReviews}
              prefix={<CommentOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tích cực"
              value={positiveReviews}
              prefix={<StarFilled />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tiêu cực"
              value={negativeReviews}
              prefix={<StarFilled />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đã trả lời"
              value={repliedReviews}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="shadow-sm">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Danh sách đánh giá sản phẩm
            </h3>
            <p className="text-gray-600 text-sm">
              Quản lý và phản hồi đánh giá từ khách hàng
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Input
              placeholder="Tìm kiếm đánh giá..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />

            <Select
              placeholder="Chọn sản phẩm"
              value={selectedProductId}
              onChange={setSelectedProductId}
              style={{ width: 200 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {allProducts.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.name}
                </Option>
              ))}
            </Select>

            <Button
              onClick={handleRefresh}
              loading={isLoading}
              icon={<ReloadOutlined />}
            >
              Làm mới
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredReviews}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đánh giá`,
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <div className="py-8">
                <div className="text-gray-400 text-4xl mb-2">⭐</div>
                <div className="text-gray-500">Không có đánh giá nào</div>
              </div>
            ),
          }}
          rowClassName={(record) => {
            if (record.rating >= 4) return "bg-green-50";
            if (record.rating >= 3) return "bg-yellow-50";
            return "bg-red-50";
          }}
        />
      </Card>

      {/* Reply Modal */}
      <Modal
        title="Trả lời đánh giá"
        open={replyModalVisible}
        onOk={handleSubmitReply}
        onCancel={() => {
          setReplyModalVisible(false);
          setReplyText("");
          setSelectedReview(null);
        }}
        confirmLoading={replyMutation.isPending}
        okText="Gửi trả lời"
        cancelText="Hủy bỏ"
        width={600}
      >
        {selectedReview && (
          <div>
            {/* Original Review */}
            <div className="mb-4 p-4 bg-gray-50 rounded border-l-4 border-gray-400">
              <div className="flex items-center mb-2">
                <Avatar
                  size={24}
                  src={getImageUrl(selectedReview.userId?.avatar)}
                  icon={<UserOutlined />}
                />
                <span className="ml-2 font-medium">
                  {selectedReview.userId?.name ||
                    selectedReview.userId?.username ||
                    "Ẩn danh"}
                </span>
                <Rate
                  disabled
                  defaultValue={selectedReview.rating || 0}
                  size="small"
                  className="ml-3"
                />
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedReview.comment}
              </p>
            </div>

            {/* Previous Replies */}
            {selectedReview.replies && selectedReview.replies.length > 0 && (
              <div className="mb-4">
                <div className="font-medium text-gray-700 mb-2">
                  Các phản hồi trước:
                </div>
                {selectedReview.replies.map((reply, index) => (
                  <div
                    key={index}
                    className="mb-2 p-3 bg-blue-50 rounded border-l-4 border-blue-400"
                  >
                    <p className="text-blue-700">{reply.content}</p>
                    <div className="text-xs text-blue-500 mt-1">
                      {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung trả lời:
              </label>
              <TextArea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                maxLength={500}
                showCount
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
