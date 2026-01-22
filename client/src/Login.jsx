import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginThunk } from "./features/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.user.status.logLoadingBtn);
  const auth = useSelector((state) => state.user.status.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (auth) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  const onSubmit = async (data) => {
    await dispatch(userLoginThunk(data))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error)
      })
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--pixel-black)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px'
      }}>
        {/* Retro Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 className="pixel-h1" style={{ color: 'var(--pixel-primary)', marginBottom: '10px' }}>
            🎮 ZUNG CHAT
          </h1>
          <p className="pixel-h3" style={{ color: 'var(--pixel-accent)' }}>
            PLAYER LOGIN
          </p>
        </div>

        {/* Login Card */}
        <div className="pixel-card">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email Input */}
            <div>
              <label className="pixel-h3" style={{ display: 'block', marginBottom: '8px', color: 'var(--pixel-accent)' }}>
                EMAIL
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="pixel-input"
                style={{ width: '100%' }}
                placeholder="player@zung.com"
              />
              {errors.email && (
                <span style={{
                  color: 'var(--pixel-danger)',
                  fontSize: '14px',
                  fontFamily: 'VT323',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  ⚠️ {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="pixel-h3" style={{ display: 'block', marginBottom: '8px', color: 'var(--pixel-accent)' }}>
                PASSWORD
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="pixel-input"
                style={{ width: '100%' }}
                placeholder="••••••••"
              />
              {errors.password && (
                <span style={{
                  color: 'var(--pixel-danger)',
                  fontSize: '14px',
                  fontFamily: 'VT323',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  ⚠️ {errors.password.message}
                </span>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="pixel-button"
              disabled={loader}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loader ? "LOADING..." : "LOGIN"}
            </button>

            {/* Sign Up Link */}
            <p style={{
              textAlign: 'center',
              fontFamily: 'VT323',
              fontSize: '18px',
              color: 'var(--pixel-light-gray)',
              marginTop: '10px'
            }}>
              NEW PLAYER?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{
                  color: 'var(--pixel-primary)',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                REGISTER HERE
              </span>
            </p>
          </form>
        </div>

        {/* Pixel Art Decoration */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          fontFamily: 'VT323',
          color: 'var(--pixel-gray)',
          fontSize: '16px'
        }}>
          ▲ ▼ ◄ ► START SELECT
        </div>
      </div>
    </div>
  );
};

export default Login;
