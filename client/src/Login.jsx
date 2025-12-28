import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginThunk } from "./features/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.user.status.logLoadingBtn);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

const onSubmit = async (data) => {
  await dispatch(userLoginThunk(data))
  .unwrap()
    .then((data) => {
      console.log(data)
      navigate("/");
    })
    .catch((error) => {
      console.log(error)
    })
};


  return (
    <center className="bg-slate-700 min-h-screen flex items-center justify-center">
      <div className="bg-slate-900 h-screen flex flex-col max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="bg-slate-900 p-4 max-h-[10vh] text-white flex justify-between items-center border-b border-slate-700">
          <h1 className="text-xl font-bold">Login</h1>
          <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">
            Help
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-slate-800 p-8 rounded w-80 flex flex-col gap-4"
          >
            <h2 className="text-white text-2xl mb-4 text-center">Sign In</h2>

            <div className="flex flex-col">
              <label className="text-white mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-1">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition-colors"
            >
              {loader ? "Loading..." : "Login"}
            </button>

            <p className="text-slate-400 text-sm mt-2 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-400 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </center>
  );
};

export default Login;
