// IP middleware for express
const getIpInfoMiddleware = async (req, res, next) => {
  const xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(
    /:\d+$/,
    ''
  );
  const ip = xForwardedFor || req.connection.remoteAddress;
  req.IPAdress = ip;
  next();
};

export default {
  getIpInfoMiddleware
};
