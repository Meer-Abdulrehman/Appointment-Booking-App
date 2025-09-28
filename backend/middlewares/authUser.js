import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    // 1. Token uthao custom header "token" se
    const token = req.headers.token;

    // 2. Agar token missing ho
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing"
      });
    }

    // 3. Token verify karo
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. User id attach karo request ke andar
    req.userId = token_decoded.id;

    // 5. Next controller ko call do
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token"
    });
  }
};

export default authUser;
