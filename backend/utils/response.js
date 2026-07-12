exports.successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({ success: true, message, data });
};

exports.errorResponse = (res, statusCode = 500, message = 'Internal Server Error', data = null) => {
  return res.status(statusCode).json({ success: false, message, data });
};
