// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Statistic, Table, DatePicker, Spin, Tag } from "antd";
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
                unit: unit,
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

        setOverview(overviewRes.data);
        setRevenue(revenueRes.data);
        setPaymentMethods(paymentRes.data);
        setTopVariants(topVariantRes.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  if (loading) return <Spin className="w-full mt-20" />;

  return (
    <div className="p-6 space-y-6">
      {/* Bộ lọc ngày */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="text-xl font-semibold">Thống kê theo thời gian</h2>
        <DatePicker.RangePicker
          className="mt-2 md:mt-0"
          value={dateRange}
          onChange={(values) => setDateRange(values)}
          format="YYYY-MM-DD"
        />
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md bg-blue-50">
          <Statistic title="Tổng đơn hàng" value={overview.totalOrders} />
        </Card>
        <Card className="shadow-md bg-green-50">
          <Statistic
            title="Tổng doanh thu"
            value={overview.totalRevenue.toLocaleString("vi-VN")}
            suffix="₫"
          />
        </Card>
        <Card className="shadow-md bg-red-50">
          <Statistic title="Đơn bị hủy" value={overview.canceledOrders} />
        </Card>
      </div>

      {/* Doanh thu theo thời gian */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Doanh thu</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={revenue}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#10b981"
              name="Doanh thu"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Đơn hàng theo thời gian */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Đơn hàng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={revenue}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalOrders"
              stroke="#3b82f6"
              name="Đơn hàng"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
        <Table
          rowKey="_id"
          dataSource={paymentMethods}
          columns={[
            { title: "Phương thức", dataIndex: "_id", key: "_id" },
            { title: "Số đơn hàng", dataIndex: "count", key: "count" },
          ]}
          pagination={false}
        />
      </div>

      {/* Top sản phẩm biến thể bán chạy */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Top 10 sản phẩm bán chạy</h2>
        <Table
          rowKey={(record) => `${record.sku}-${record.productName}`}
          dataSource={topVariants}
          columns={[
            { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
            { title: "SKU", dataIndex: "sku", key: "sku" },
            {
              title: "Thuộc tính",
              dataIndex: "attributes",
              key: "attributes",
              render: (attrs) => (
                <>
                  {Object.entries(attrs || {}).map(([key, value]) => (
                    <Tag key={key} color="blue" className="mb-1">
                      {key}: {value}
                    </Tag>
                  ))}
                </>
              ),
            },
            {
              title: "Số lượng bán",
              dataIndex: "totalQuantity",
              key: "totalQuantity",
            },
          ]}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
