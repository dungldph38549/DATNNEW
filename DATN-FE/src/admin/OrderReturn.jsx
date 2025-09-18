import {
  Table, Spin, Button, message
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  orderReturn,
  acceptOrRejectReturn
} from '../api/index';
import Swal from 'sweetalert2';

export default function Brands() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['return-orders'],
    queryFn: () => orderReturn(),
    keepPreviousData: true,
  });

  const acceptOrRejectMutation = useMutation({
    mutationFn: ({ id, note, status }) => acceptOrRejectReturn({ id, note, status }),
    onSuccess: () => {
      message.success('Thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    },
  });

  const handleAcceptReject = async (id, status) => {
    const result = await Swal.fire({
      title: status === 'accepted' ? 'Xác nhận chấp nhận hoàn hàng' : 'Xác nhận từ chối hoàn hàng',
      input: 'textarea',
      inputPlaceholder: 'Nhập ghi chú...',
      showCancelButton: true,
      confirmButtonText: status === 'accepted' ? 'Chấp nhận' : 'Từ chối',
      cancelButtonText: 'Huỷ',
      inputValidator: (value) => {
        if (!value) {
          return 'Vui lòng nhập ghi chú!';
        }
      },
    });

    if (result.isConfirmed) {
      acceptOrRejectMutation.mutate({
        id,
        note: result.value,
        status,
      });
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (order) => {
        return order._id;
      }
    },
     {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 140,
      render: (img) => img && (
          <img
            src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${img}`}
            alt="Ảnh"
            width={120}
            height={'auto'}
            className="object-cover rounded"
          />
      )
    },
    {
      title: 'Lý do',
      dataIndex: 'note',
      key: 'note',
      render: (note) => {
        return note;
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) =>
        new Date(date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => {
        console.log(record);
        
        return (
          <>
          <Button type="link" onClick={() => handleAcceptReject(record.orderId._id, 'accepted')}>
            Đồng ý
          </Button>
          <Button type="link" danger onClick={() => handleAcceptReject(record.orderId._id, 'rejected')}>
            Từ chối
          </Button>
        </>
        )
      },
    },
  ];

  if (isLoading) {
    return <Spin tip="Đang tải danh sách ..." className="mt-10 block text-center" />;
  }

  if (isError || !data) {
    return <div className="text-center text-red-500">Lỗi khi tải danh sách.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <Table
        columns={columns}
        dataSource={data.map((v) => ({ ...v, key: v._id }))}
        bordered
        pagination={false}
      />
    </div>
  );
}
