// src/pages/admin/StaffManagement.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Upload,
  message,
  Tabs,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UploadOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getAllUser, updateUserById, uploadImage } from "../api/index";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export default function StaffManagement() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  // Local states
  const [selectedTab, setSelectedTab] = useState("1");
  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch staff data
  const {
    data: staffData,
    isLoading: staffLoading,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["staff-management"],
    queryFn: () => getAllUser(1, 1000),
    staleTime: 2 * 60 * 1000,
  });

  // Create/Update staff mutation
  const staffMutation = useMutation({
    mutationFn: (payload) => {
      if (isEditing && selectedStaff) {
        return updateUserById(selectedStaff._id, payload);
      }
      // Note: You might need a createUser API endpoint
      return updateUserById("new", payload);
    },
    onSuccess: () => {
      message.success(
        isEditing
          ? "Cập nhật nhân viên thành công"
          : "Thêm nhân viên thành công"
      );
      setStaffModalVisible(false);
      setSelectedStaff(null);
      setIsEditing(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["staff-management"] });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Process staff data
  const allStaff = staffData?.data || [];
  const staffOnly = allStaff.filter((user) => user.role !== "customer"); // Exclude customers

  // Calculate statistics
  const totalStaff = staffOnly.length;
  const activeStaff = staffOnly.filter(
    (staff) => staff.isActive !== false
  ).length;
  const adminCount = staffOnly.filter(
    (staff) => staff.isAdmin || staff.role === "admin"
  ).length;
  const managerCount = staffOnly.filter(
    (staff) => staff.role === "manager"
  ).length;

  // Filter staff
  const filteredStaff = staffOnly.filter((staff) => {
    const matchesSearch =
      staff.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && (staff.isAdmin || staff.role === "admin")) ||
      (roleFilter === "manager" && staff.role === "manager") ||
      (roleFilter === "staff" &&
        !staff.isAdmin &&
        staff.role !== "admin" &&
        staff.role !== "manager");

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && staff.isActive !== false) ||
      (statusFilter === "inactive" && staff.isActive === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle staff modal
  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsEditing(false);
    setStaffModalVisible(true);
    form.resetFields();
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setIsEditing(true);
    setStaffModalVisible(true);

    // Pre-fill form
    form.setFieldsValue({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      address: staff.address,
      role: staff.isAdmin ? "admin" : staff.role || "staff",
      isActive: staff.isActive !== false,
      position: staff.position,
      department: staff.department,
      salary: staff.salary,
      startDate: staff.startDate ? dayjs(staff.startDate) : null,
      notes: staff.notes,
    });
  };

  const handleDeleteStaff = (staff) => {
    Modal.confirm({
      title: "Xác nhận xóa nhân viên",
      content: `Bạn có chắc chắn muốn xóa nhân viên "${staff.name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        // Set inactive instead of delete
        staffMutation.mutate({
          ...staff,
          isActive: false,
        });
      },
    });
  };

  // Submit form
  const onFinishStaff = (values) => {
    const payload = {
      ...values,
      isAdmin: values.role === "admin",
      role: values.role === "admin" ? "admin" : values.role,
      startDate: values.startDate ? values.startDate.toISOString() : null,
    };

    staffMutation.mutate(payload);
  };

  // Get role tag
  const getRoleTag = (staff) => {
    if (staff.isAdmin || staff.role === "admin") {
      return <Tag color="red">Admin</Tag>;
    }
    if (staff.role === "manager") {
      return <Tag color="blue">Manager</Tag>;
    }
    return <Tag color="green">Staff</Tag>;
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return (
      <Badge
        status={isActive !== false ? "success" : "error"}
        text={isActive !== false ? "Hoạt động" : "Tạm ngưng"}
      />
    );
  };

  // Table columns
  const staffColumns = [
    {
      title: "Nhân viên",
      key: "employee",
      fixed: "left",
      width: 250,
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar
            size={40}
            src={
              record.avatar
                ? `${process.env.REACT_APP_API_URL_BACKEND}/image/${record.avatar}`
                : null
            }
            icon={<UserOutlined />}
            className="mr-3"
          />
          <div>
            <div className="font-medium">{record.name || "Chưa cập nhật"}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
            <div className="text-xs text-gray-400">{record.phone || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      key: "role",
      width: 120,
      render: (_, record) => getRoleTag(record),
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Manager", value: "manager" },
        { text: "Staff", value: "staff" },
      ],
      onFilter: (value, record) => {
        if (value === "admin") return record.isAdmin || record.role === "admin";
        if (value === "manager") return record.role === "manager";
        return (
          !record.isAdmin &&
          record.role !== "admin" &&
          record.role !== "manager"
        );
      },
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      width: 150,
      render: (position) =>
        position || <span className="text-gray-400">Chưa cập nhật</span>,
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 120,
      render: (department) =>
        department || <span className="text-gray-400">Chưa cập nhật</span>,
    },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      width: 120,
      render: (salary) =>
        salary ? (
          <span className="font-semibold text-green-600">
            {salary.toLocaleString()}₫
          </span>
        ) : (
          <span className="text-gray-400">Chưa cập nhật</span>
        ),
    },
    {
      title: "Ngày vào làm",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date) =>
        date ? (
          dayjs(date).format("DD/MM/YYYY")
        ) : (
          <span className="text-gray-400">Chưa cập nhật</span>
        ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => getStatusBadge(record.isActive),
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: "Thông tin nhân viên",
                  width: 600,
                  content: (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <Avatar
                          size={60}
                          src={
                            record.avatar
                              ? `${process.env.REACT_APP_API_URL_BACKEND}/image/${record.avatar}`
                              : null
                          }
                          icon={<UserOutlined />}
                          className="mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">
                            {record.name}
                          </h3>
                          {getRoleTag(record)}
                        </div>
                      </div>

                      <Divider />

                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <strong>Email:</strong> {record.email}
                        </Col>
                        <Col span={12}>
                          <strong>Điện thoại:</strong>{" "}
                          {record.phone || "Chưa cập nhật"}
                        </Col>
                        <Col span={12}>
                          <strong>Chức vụ:</strong>{" "}
                          {record.position || "Chưa cập nhật"}
                        </Col>
                        <Col span={12}>
                          <strong>Phòng ban:</strong>{" "}
                          {record.department || "Chưa cập nhật"}
                        </Col>
                        <Col span={12}>
                          <strong>Lương:</strong>{" "}
                          {record.salary
                            ? `${record.salary.toLocaleString()}₫`
                            : "Chưa cập nhật"}
                        </Col>
                        <Col span={12}>
                          <strong>Ngày vào làm:</strong>{" "}
                          {record.startDate
                            ? dayjs(record.startDate).format("DD/MM/YYYY")
                            : "Chưa cập nhật"}
                        </Col>
                        <Col span={24}>
                          <strong>Địa chỉ:</strong>{" "}
                          {record.address || "Chưa cập nhật"}
                        </Col>
                        {record.notes && (
                          <Col span={24}>
                            <strong>Ghi chú:</strong> {record.notes}
                          </Col>
                        )}
                      </Row>
                    </div>
                  ),
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditStaff(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteStaff(record)}
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
          Quản lý nhân viên - PSG Store
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin nhân viên, phân quyền và theo dõi hoạt động
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng nhân viên"
              value={totalStaff}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeStaff}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Admin"
              value={adminCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Manager"
              value={managerCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={selectedTab} onChange={setSelectedTab}>
          <TabPane tab="Danh sách nhân viên" key="1">
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddStaff}
              >
                Thêm nhân viên
              </Button>

              <Input
                placeholder="Tìm kiếm nhân viên..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />

              <Select
                placeholder="Lọc vai trò"
                value={roleFilter}
                onChange={setRoleFilter}
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="staff">Staff</Option>
              </Select>

              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Tạm ngưng</Option>
              </Select>

              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetchStaff()}
                loading={staffLoading}
              >
                Làm mới
              </Button>
            </div>

            {/* Staff Table */}
            <Table
              columns={staffColumns}
              dataSource={filteredStaff.map((staff) => ({
                ...staff,
                key: staff._id,
              }))}
              loading={staffLoading}
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} nhân viên`,
              }}
            />
          </TabPane>

          <TabPane tab="Chấm công" key="2">
            <div className="text-center py-20">
              <ClockCircleOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl text-gray-500 mb-2">Chấm công</h3>
              <p className="text-gray-400">Chức năng đang phát triển</p>
            </div>
          </TabPane>

          <TabPane tab="Lương thưởng" key="3">
            <div className="text-center py-20">
              <DollarOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl text-gray-500 mb-2">
                Quản lý lương thưởng
              </h3>
              <p className="text-gray-400">Chức năng đang phát triển</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Staff Modal */}
      <Modal
        title={isEditing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={staffModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setStaffModalVisible(false);
          setSelectedStaff(null);
          setIsEditing(false);
          form.resetFields();
        }}
        confirmLoading={staffMutation.isPending}
        width={800}
      >
        <Form form={form} onFinish={onFinishStaff} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="staff">Staff</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="position" label="Chức vụ">
                <Input placeholder="Nhập chức vụ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="Phòng ban">
                <Select placeholder="Chọn phòng ban">
                  <Option value="sales">Bán hàng</Option>
                  <Option value="warehouse">Kho</Option>
                  <Option value="customer-service">Chăm sóc khách hàng</Option>
                  <Option value="marketing">Marketing</Option>
                  <Option value="admin">Hành chính</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="salary" label="Lương (VNĐ)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập lương"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startDate" label="Ngày vào làm">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày vào làm"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Địa chỉ">
            <TextArea rows={2} placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={18}>
              <Form.Item name="notes" label="Ghi chú">
                <TextArea rows={3} placeholder="Ghi chú thêm về nhân viên" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isActive"
                label="Trạng thái"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Tạm ngưng"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
