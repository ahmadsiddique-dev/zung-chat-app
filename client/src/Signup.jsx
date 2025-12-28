import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSignupThunk } from "./features/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.user.status.signLoadingBtn);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await dispatch(userSignupThunk(data))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
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
          <h1 className="pixel-h1" style={{ color: 'var(--pixel-success)', marginBottom: '10px' }}>
            🎮 ZUNG CHAT
          </h1>
          <p className="pixel-h3" style={{ color: 'var(--pixel-accent)' }}>
            NEW PLAYER REGISTER
          </p>
        </div>

        {/* Signup Card */}
        <div className="pixel-card">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Username Input */}
            <div>
              <label className="pixel-h3" style={{ display: 'block', marginBottom: '8px', color: 'var(--pixel-accent)' }}>
                USERNAME
              </label>
              <input
                type="text"
                {...register("userName", { required: "Username is required" })}
                className="pixel-input"
                style={{ width: '100%' }}
                placeholder="player1"
              />
              {errors.userName && (
                <span style={{
                  color: 'var(--pixel-danger)',
                  fontSize: '14px',
                  fontFamily: 'VT323',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  ⚠️ {errors.userName.message}
                </span>
              )}
            </div>

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

            {/* Register Button */}
            <button
              type="submit"
              className="pixel-button pixel-button-success"
              disabled={loader}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loader ? "LOADING..." : "REGISTER"}
            </button>

            {/* Login Link */}
            <p style={{
              textAlign: 'center',
              fontFamily: 'VT323',
              fontSize: '18px',
              color: 'var(--pixel-light-gray)',
              marginTop: '10px'
            }}>
              HAVE AN ACCOUNT?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{
                  color: 'var(--pixel-success)',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                LOGIN HERE
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
          ★ ★ ★ GAME START ★ ★ ★
        </div>
      </div>
    </div>
  );
};

export default SignUp;
