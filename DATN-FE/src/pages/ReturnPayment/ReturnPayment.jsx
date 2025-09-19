// src/pages/PaymentResult.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { checkPayment } from "../../api";
import { useQuery } from "@tanstack/react-query";

const PaymentResult = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const queryObject = {};
  for (const [key, value] of params.entries()) {
    queryObject[key] = value;
  }
  const payload = new URLSearchParams(queryObject).toString();
  const { data, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: () => {
      return checkPayment(payload);
    },
  });

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 className="text-3xl font-semibold mb-4">Kết quả thanh toán</h2>
      {queryObject && (
        <>
          <p className="mb-2 text-lg">
            Mã đơn hàng: <strong>{queryObject.vnp_TxnRef}</strong>
          </p>
          <p className="mb-2 text-lg">
            Số tiền:{" "}
            <strong>
              {(Number(queryObject.vnp_Amount) / 100)?.toLocaleString("vi-VN")}{" "}
              VND
            </strong>
          </p>
        </>
      )}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="mb-20">
          {data.message && <p className="mb-5 text-lg"> {data.message}</p>}
          <Link
            to="/"
            className="mr-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Mua sắm
          </Link>
          <Link
            to="/orders"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Đơn hàng
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
