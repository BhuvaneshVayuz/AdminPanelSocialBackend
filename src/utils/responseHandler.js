const sendResponse = ({ res, statusCode, message, data = null }) => {
  return res.status(statusCode).json({
    status_code: statusCode,
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};

const sendErrorResponse = ({
  res,
  statusCode = 500,
  message,
  error = null,
}) => {
  return res.status(statusCode).json({
    status_code: statusCode,
    success: false,
    message,
    error,
  });
};

export { sendResponse, sendErrorResponse };
