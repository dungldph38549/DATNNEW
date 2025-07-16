import express from 'express';

export const successResponse = ({ 
  res, 
  message = "Success",
  data = null,
  meta = null,
  statusCode = 200}) => {
  return res.status(statusCode).json({
    status: true,
    message,
    data,
    ...(meta && { meta }), 
  });
}


export const errorResponse = (
  { 
    res, 
    message = "Error",
    data = null,
    statusCode = 400 
  } 
) => {
  return res.status(statusCode).json({
    status: false,
    message,
    ...(data && { data }),
  });
};
