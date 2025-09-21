// src/pages/admin/InventoryManagement.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
  Tabs,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  Alert,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  EyeOutlined,
  WarningOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  BarChartOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  getAllProducts,
  updateProduct,
  getAllBrands,
  getAllCategories,
  uploadImage,
} from "../api/index";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export default function InventoryManagement() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  // Local states
  const [selectedTab, setSelectedTab] = useState("1");
  const [stockInModalVisible, setStockInModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // Fetch products with inventory info
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["inventory-products"],
    queryFn: () =>
      getAllProducts({
        page: 1,
        limit: 1000,
        isListProductRemoved: false,
        filter: {},
      }),
    staleTime: 2 * 60 * 1000,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands-inventory"],
    queryFn: () => getAllBrands("active"),
    staleTime: 10 * 60 * 1000,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-inventory"],
    queryFn: () => getAllCategories("active"),
    staleTime: 10 * 60 * 1000,
  });

  // Update product inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProduct({ id, payload }),
    onSuccess: () => {
      message.success("Cập nhật kho hàng thành công");
      setStockInModalVisible(false);
      setSelectedProduct(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["inventory-products"] });
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật kho"
      );
    },
  });

  // Process products data
  const products = productsData?.data || [];
  const brands = brandsData?.data || [];
  const categories = categoriesData?.data || [];

  // Calculate inventory statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter((product) => {
    if (product.hasVariants) {
      return product.variants.some((variant) => variant.stock < 10);
    }
    return product.countInStock < 10;
  }).length;

  const outOfStockProducts = products.filter((product) => {
    if (product.hasVariants) {
      return product.variants.every((variant) => variant.stock === 0);
    }
    return product.countInStock === 0;
  }).length;

  const totalValue = products.reduce((sum, product) => {
    if (product.hasVariants) {
      return (
        sum +
        product.variants.reduce(
          (varSum, variant) => varSum + variant.price * variant.stock,
          0
        )
      );
    }
    return sum + product.price * product.countInStock;
  }, 0);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesBrand = !brandFilter || product.brandId === brandFilter;

    let matchesStock = true;
    if (stockFilter === "low") {
      if (product.hasVariants) {
        matchesStock = product.variants.some(
          (variant) => variant.stock < 10 && variant.stock > 0
        );
      } else {
        matchesStock = product.countInStock < 10 && product.countInStock > 0;
      }
    } else if (stockFilter === "out") {
      if (product.hasVariants) {
        matchesStock = product.variants.every((variant) => variant.stock === 0);
      } else {
        matchesStock = product.countInStock === 0;
      }
    }

    return matchesSearch && matchesBrand && matchesStock;
  });

  // Handle stock in modal
  const handleStockIn = (product) => {
    setSelectedProduct(product);
    setStockInModalVisible(true);

    // Pre-fill form
    if (product.hasVariants) {
      form.setFieldsValue({
        stockUpdates: product.variants.map((variant) => ({
          sku: variant.sku,
          currentStock: variant.stock,
          addQuantity: 0,
          newPrice: variant.price,
        })),
      });
    } else {
      form.setFieldsValue({
        currentStock: product.countInStock,
        addQuantity: 0,
        newPrice: product.price,
      });
    }
  };

  // Submit stock update
  const onFinishStockUpdate = (values) => {
    if (!selectedProduct) return;

    let payload = {};

    if (selectedProduct.hasVariants) {
      const updatedVariants = selectedProduct.variants.map((variant, index) => {
        const update = values.stockUpdates[index];
        return {
          ...variant,
          stock: variant.stock + (update.addQuantity || 0),
          price: update.newPrice || variant.price,
        };
      });
      payload = { variants: updatedVariants };
    } else {
      payload = {
        countInStock: selectedProduct.countInStock + (values.addQuantity || 0),
        price: values.newPrice || selectedProduct.price,
      };
    }

    updateInventoryMutation.mutate({
      id: selectedProduct._id,
      payload,
    });
  };

  // Table columns for inventory
  const inventoryColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 250,
      render: (name, record) => (
        <div className="flex items-center">
          <img
            src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${record.image}`}
            alt={name}
            className="w-12 h-12 object-cover rounded mr-3"
            onError={(e) => {
              e.target.src = "/placeholder-image.png";
            }}
          />
          <div>
            <div className="font-medium text-sm">{name}</div>
            <div className="text-xs text-gray-500">
              {brands.find((b) => b._id === record.brandId)?.name || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "SKU/Variants",
      key: "variants",
      width: 200,
      render: (_, record) => {
        if (record.hasVariants) {
          return (
            <div className="space-y-1">
              {record.variants.map((variant, index) => (
                <div key={index} className="text-xs">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {variant.sku}
                  </span>
                  <div className="text-gray-500">
                    {Object.entries(variant.attributes || {})
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return <span className="text-gray-500">Không có variants</span>;
      },
    },
    {
      title: "Tồn kho",
      key: "stock",
      width: 120,
      render: (_, record) => {
        if (record.hasVariants) {
          return (
            <div className="space-y-1">
              {record.variants.map((variant, index) => {
                const isLow = variant.stock < 10;
                const isOut = variant.stock === 0;
                return (
                  <div key={index} className="flex items-center">
                    <Badge
                      count={variant.stock}
                      showZero
                      style={{
                        backgroundColor: isOut
                          ? "#ff4d4f"
                          : isLow
                          ? "#faad14"
                          : "#52c41a",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        }

        const isLow = record.countInStock < 10;
        const isOut = record.countInStock === 0;
        return (
          <Badge
            count={record.countInStock}
            showZero
            style={{
              backgroundColor: isOut
                ? "#ff4d4f"
                : isLow
                ? "#faad14"
                : "#52c41a",
            }}
          />
        );
      },
    },
    {
      title: "Giá bán",
      key: "price",
      width: 150,
      render: (_, record) => {
        if (record.hasVariants) {
          const prices = record.variants.map((v) => v.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          if (minPrice === maxPrice) {
            return (
              <span className="font-semibold">
                {minPrice.toLocaleString()}₫
              </span>
            );
          }
          return (
            <span className="font-semibold">
              {minPrice.toLocaleString()}₫ - {maxPrice.toLocaleString()}₫
            </span>
          );
        }
        return (
          <span className="font-semibold">
            {record.price.toLocaleString()}₫
          </span>
        );
      },
    },
    {
      title: "Đã bán",
      key: "sold",
      width: 100,
      render: (_, record) => {
        if (record.hasVariants) {
          const totalSold = record.variants.reduce(
            (sum, v) => sum + (v.sold || 0),
            0
          );
          return <span className="text-blue-600 font-medium">{totalSold}</span>;
        }
        return (
          <span className="text-blue-600 font-medium">{record.sold || 0}</span>
        );
      },
    },
    {
      title: "Giá trị kho",
      key: "value",
      width: 150,
      render: (_, record) => {
        let totalValue = 0;
        if (record.hasVariants) {
          totalValue = record.variants.reduce(
            (sum, variant) => sum + variant.price * variant.stock,
            0
          );
        } else {
          totalValue = record.price * record.countInStock;
        }
        return (
          <span className="font-semibold text-green-600">
            {totalValue.toLocaleString()}₫
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Nhập kho">
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleStockIn(record)}
            >
              Nhập kho
            </Button>
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: "Chi tiết sản phẩm",
                  content: (
                    <div className="space-y-4">
                      <div>
                        <strong>Tên:</strong> {record.name}
                      </div>
                      <div>
                        <strong>Mô tả:</strong> {record.description}
                      </div>
                      <div>
                        <strong>Thương hiệu:</strong>{" "}
                        {brands.find((b) => b._id === record.brandId)?.name}
                      </div>
                      <div>
                        <strong>Danh mục:</strong>{" "}
                        {
                          categories.find((c) => c._id === record.categoryId)
                            ?.name
                        }
                      </div>
                      {record.hasVariants && (
                        <div>
                          <strong>Variants:</strong>
                          <div className="mt-2 space-y-2">
                            {record.variants.map((variant, idx) => (
                              <div key={idx} className="bg-gray-50 p-2 rounded">
                                <div>SKU: {variant.sku}</div>
                                <div>
                                  Giá: {variant.price.toLocaleString()}₫
                                </div>
                                <div>Tồn kho: {variant.stock}</div>
                                <div>Đã bán: {variant.sold || 0}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                  width: 600,
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý kho hàng - PSG Store
        </h1>
        <p className="text-gray-600">
          Quản lý tồn kho, nhập hàng và theo dõi inventory
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Sắp hết hàng"
              value={lowStockProducts}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Hết hàng"
              value={outOfStockProducts}
              prefix={<InboxOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Giá trị kho"
              value={totalValue}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#52c41a" }}
              formatter={(value) => `${value?.toLocaleString()}₫`}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={selectedTab} onChange={setSelectedTab}>
          <TabPane tab="Danh sách kho hàng" key="1">
            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />

              <Select
                placeholder="Lọc thương hiệu"
                value={brandFilter}
                onChange={setBrandFilter}
                style={{ width: 200 }}
                allowClear
              >
                {brands.map((brand) => (
                  <Option key={brand._id} value={brand._id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Trạng thái kho"
                value={stockFilter}
                onChange={setStockFilter}
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="low">Sắp hết</Option>
                <Option value="out">Hết hàng</Option>
              </Select>

              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetchProducts()}
                loading={productsLoading}
              >
                Làm mới
              </Button>
            </div>

            {/* Alerts */}
            {lowStockProducts > 0 && (
              <Alert
                message={`Có ${lowStockProducts} sản phẩm sắp hết hàng`}
                type="warning"
                showIcon
                className="mb-4"
              />
            )}

            {outOfStockProducts > 0 && (
              <Alert
                message={`Có ${outOfStockProducts} sản phẩm đã hết hàng`}
                type="error"
                showIcon
                className="mb-4"
              />
            )}

            {/* Inventory Table */}
            <Table
              columns={inventoryColumns}
              dataSource={filteredProducts.map((p) => ({ ...p, key: p._id }))}
              loading={productsLoading}
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} sản phẩm`,
              }}
            />
          </TabPane>

          <TabPane tab="Báo cáo kho" key="2">
            <div className="text-center py-20">
              <BarChartOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl text-gray-500 mb-2">Báo cáo kho hàng</h3>
              <p className="text-gray-400">Chức năng đang phát triển</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Stock In Modal */}
      <Modal
        title={`Nhập kho - ${selectedProduct?.name}`}
        open={stockInModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setStockInModalVisible(false);
          setSelectedProduct(null);
          form.resetFields();
        }}
        confirmLoading={updateInventoryMutation.isPending}
        width={800}
      >
        <Form form={form} onFinish={onFinishStockUpdate} layout="vertical">
          {selectedProduct?.hasVariants ? (
            <div>
              <h4 className="mb-4 font-semibold">
                Cập nhật kho theo variants:
              </h4>
              <Form.List name="stockUpdates">
                {(fields) => (
                  <div className="space-y-4">
                    {fields.map((field, index) => {
                      const variant = selectedProduct.variants[index];
                      return (
                        <Card key={field.key} size="small">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong>SKU:</strong> {variant.sku}
                              <br />
                              <span className="text-sm text-gray-500">
                                {Object.entries(variant.attributes || {})
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(", ")}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <Form.Item
                                name={[field.name, "currentStock"]}
                                label="Tồn kho hiện tại"
                              >
                                <InputNumber disabled />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "addQuantity"]}
                                label="Số lượng nhập"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập số lượng",
                                  },
                                ]}
                              >
                                <InputNumber
                                  min={0}
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "newPrice"]}
                                label="Giá mới (tùy chọn)"
                              >
                                <InputNumber
                                  min={0}
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(value) =>
                                    value.replace(/\$\s?|(,*)/g, "")
                                  }
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </Form.List>
            </div>
          ) : (
            <div className="space-y-4">
              <Form.Item name="currentStock" label="Tồn kho hiện tại">
                <InputNumber disabled style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="addQuantity"
                label="Số lượng nhập"
                rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="newPrice" label="Giá mới (tùy chọn)">
                <InputNumber
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          )}

          <Divider />
          <Form.Item name="note" label="Ghi chú nhập kho">
            <TextArea rows={3} placeholder="Ghi chú về đợt nhập kho này..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
