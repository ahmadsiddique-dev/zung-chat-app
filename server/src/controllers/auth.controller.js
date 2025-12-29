import { authModel } from "../models/user.model.js";
import customError from "../utils/customError.js";


export const userSignupControler = async (req, res) => {
  const { userName, password, email } = req.body;
  try {
    if (!userName || !password || !email)
      throw new customError("Creadiential are missing!", 403);

    const findUser = await authModel.findOne({ email });
    
    if (findUser) throw new customError("User already exists", 409);

    
    const user = await authModel.create({
      userName,
      email,
      password,
    })

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave : false });

    res.clearCookie("refreshToken")
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    const data = {
      _id : user._id,
      userName : user.userName,
      email : user.email,
      accessToken : accessToken
    }

    res.status(200).json(data);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ status: "fail", message: error.message });
  }
};


export const userLoginControler = async (req, res) => {
  const { password, email } = req.body;
  try {
    if (!password || !email) throw new customError("Missing Credentials", 403);

    const user = await authModel.findOne({ email })
      .select("-createdAt -updatedAt -refreshToken");

    if (!user) throw new customError("User not found", 404);

    console.log(user)
    const pass = await user.verifyPassword(password);

    if (!pass) throw new customError("Invalid Credientials", 401)

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    
    await user.updateOne({ refreshToken : refreshToken })
    res.clearCookie(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    const data = {
      _id : user._id,
      userName : user.userName,
      email : user.email,
      accessToken : accessToken
    }
    
    res.status(200).json(data);

  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "fail",
      message: error.message
    });
  } 
};


export const handleRefresh = (req, res) => {
  const user = req.user;
  res.status(200).json(user);
}


export const logoutController = async (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};