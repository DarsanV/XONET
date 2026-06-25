export function errorHandler(err, req, res, next) {
    console.error("[API]", err);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: err.message || "Internal server error",
        ...(err.code ? { code: err.code } : {}),
    });
}

export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
