import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  createReturnRequest,
  getUserReturnRequests,
  getReturnRequestDetail,
  updateReturnShipping,
  cancelReturnRequest,
} from "../api/index";

export const useReturnOrders = (userId, page = 1) => {
  return useQuery({
    queryKey: ["return-orders", userId, page],
    queryFn: () => getUserReturnRequests({ userId, page, limit: 10 }),
    enabled: !!userId,
  });
};

export const useReturnOrderDetail = (returnId) => {
  return useQuery({
    queryKey: ["return-order-detail", returnId],
    queryFn: () => getReturnRequestDetail(returnId),
    enabled: !!returnId,
  });
};

export const useCreateReturnRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      message.success("Gửi yêu cầu hoàn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["return-orders"] });
      queryClient.invalidateQueries({ queryKey: ["list-order"] });
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu"
      );
    },
  });
};

export const useUpdateReturnShipping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReturnShipping,
    onSuccess: () => {
      message.success("Cập nhật thông tin vận chuyển thành công");
      queryClient.invalidateQueries({ queryKey: ["return-orders"] });
      queryClient.invalidateQueries({ queryKey: ["return-order-detail"] });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useCancelReturnRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReturnRequest,
    onSuccess: () => {
      message.success("Hủy yêu cầu hoàn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["return-orders"] });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
