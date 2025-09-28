import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.atoken;   

    if (!token) {
      return res.json({ success: false, message: "not authorized admin" });
    }

    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decoded.email !== process.env.ADMIN_EMAIL) {  
      return res.json({ success: false, message: "not authorized login again" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
