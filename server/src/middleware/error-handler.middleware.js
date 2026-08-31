const errorHandler = (err, req, res, next) => {
   console.error("Error:", err.stack || err.message || err);
   const isServerError = !err.status || err.status >= 500;
   res.status(err.status || 500).json({
       success: false,
       message: isServerError ? "Internal server error" : err.message,
   });
};
export default errorHandler;
