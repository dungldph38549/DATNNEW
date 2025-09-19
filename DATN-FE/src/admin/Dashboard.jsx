// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Statistic, Table, DatePicker, Spin, Tag, Alert } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import axiosInstance from "../api/axiosConfig";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [topVariants, setTopVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  const determineTimeUnit = (start, end) => {
    const diff = end.diff(start, "day");
    if (diff > 365) return "year";
    if (diff > 31) return "month";
    if (diff > 7) return "week";
    if (diff > 1) return "day";
    return "hour";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const unit = determineTimeUnit(dateRange[0], dateRange[1]);

        const [overviewRes, revenueRes, paymentRes, topVariantRes] =
          await Promise.all([
            axiosInstance.get("/order/dashboard", {
              params: {
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
              },
            }),
            axiosInstance.get("/order/revenue", {
              params: {
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
                unit,
              },
            }),
            axiosInstance.get("/order/paymentMethod", {
              params: {
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
              },
            }),
            axiosInstance.get("/order/topSelling", {
              params: {
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
              },
            }),
          ]);

        // Safe extract
        const overviewData = overviewRes.data?.data || overviewRes.data || {};
        const revenueData = revenueRes.data?.data || revenueRes.data || [];
        const paymentData = paymentRes.data?.data || paymentRes.data || [];
        const topVariantsData =
          topVariantRes.data?.data || topVariantRes.data || [];

        setOverview({
          totalOrders: overviewData.totalOrders || 0,
          totalRevenue: overviewData.totalRevenue || 0,
          canceledOrders: overviewData.canceledOrders || 0,
        });

        setRevenue(Array.isArray(revenueData) ? revenueData : []);
        setPaymentMethods(Array.isArray(paymentData) ? paymentData : []);
        setTopVariants(Array.isArray(topVariantsData) ? topVariantsData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Không thể tải dữ liệu dashboard";
        setError(errorMessage);

        // fallback
        setOverview({ totalOrders: 0, totalRevenue: 0, canceledOrders: 0 });
        setRevenue([]);
        setPaymentMethods([]);
        setTopVariants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert
          message="Thông báo"
          description={`${error}. Hiển thị dữ liệu mặc định.`}
          type="warning"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      )}

      {/* Bộ lọc ngày */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Thống kê theo thời gian
        </h2>
        <DatePicker.RangePicker
          className="mt-2 md:mt-0"
          value={dateRange}
          onChange={(values) => {
            if (values && values[0] && values[1]) {
              setDateRange(values);
            }
          }}
          format="YYYY-MM-DD"
          allowClear={false}
        />
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md bg-blue-50 hover:shadow-lg transition-shadow">
          <Statistic
            title="Tổng đơn hàng"
            value={overview?.totalOrders || 0}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
        <Card className="shadow-md bg-green-50 hover:shadow-lg transition-shadow">
          <Statistic
            title="Tổng doanh thu"
            value={(overview?.totalRevenue || 0).toLocaleString("vi-VN")}
            suffix="₫"
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
        <Card className="shadow-md bg-red-50 hover:shadow-lg transition-shadow">
          <Statistic
            title="Đơn bị hủy"
            value={overview?.canceledOrders || 0}
            valueStyle={{ color: "#f5222d" }}
          />
        </Card>
      </div>

      {/* Doanh thu */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Biểu đồ doanh thu
        </h2>
        {revenue && revenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenue}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString("vi-VN")}₫`,
                  "Doanh thu",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#10b981"
                name="Doanh thu"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Không có dữ liệu doanh thu
          </div>
        )}
      </div>

      {/* Đơn hàng */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Biểu đồ đơn hàng
        </h2>
        {revenue && revenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenue}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalOrders"
                stroke="#3b82f6"
                name="Số đơn hàng"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Không có dữ liệu đơn hàng
          </div>
        )}
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Phương thức thanh toán
        </h2>
        <Table
          rowKey="_id"
          dataSource={paymentMethods}
          columns={[
            {
              title: "Phương thức",
              dataIndex: "_id",
              key: "_id",
              render: (text) => (
                <Tag
                  color={
                    text === "COD"
                      ? "orange"
                      : text === "VNPay"
                      ? "blue"
                      : text === "MoMo"
                      ? "green"
                      : "default"
                  }
                >
                  {text || "N/A"}
                </Tag>
              ),
            },
            {
              title: "Số đơn hàng",
              dataIndex: "count",
              key: "count",
              render: (count) => <strong>{count || 0}</strong>,
            },
          ]}
          pagination={false}
          locale={{ emptyText: "Không có dữ liệu" }}
          size="small"
        />
      </div>

      {/* Top sản phẩm bán chạy */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Top 10 sản phẩm bán chạy
        </h2>
        <Table
          rowKey={(record, index) =>
            `${record?.sku || index}-${record?.productName || index}`
          }
          dataSource={topVariants || []}
          columns={[
            {
              title: "Sản phẩm",
              dataIndex: "productName",
              key: "productName",
              render: (text) => (
                <span className="font-medium text-blue-600">
                  {text || "N/A"}
                </span>
              ),
            },
            {
              title: "SKU",
              dataIndex: "sku",
              key: "sku",
              render: (text) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {text || "N/A"}
                </code>
              ),
            },
            {
              title: "Thuộc tính",
              dataIndex: "attributes",
              key: "attributes",
              render: (attrs) => (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(attrs || {}).map(([key, value]) => (
                    <Tag key={key} color="blue" className="mb-1 text-xs">
                      {key}: {value}
                    </Tag>
                  ))}
                  {(!attrs || Object.keys(attrs).length === 0) && (
                    <span className="text-gray-400 text-xs">Không có</span>
                  )}
                </div>
              ),
            },
            {
              title: "Số lượng bán",
              dataIndex: "totalQuantity",
              key: "totalQuantity",
              render: (quantity) => (
                <span className="font-bold text-green-600">
                  {quantity || 0}
                </span>
              ),
              sorter: (a, b) => (a.totalQuantity || 0) - (b.totalQuantity || 0),
            },
          ]}
          pagination={false}
          locale={{ emptyText: "Không có dữ liệu" }}
          size="small"
        />
      </div>
    </div>
  );
};

export default Dashboard;
