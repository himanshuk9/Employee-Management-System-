// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../svg/animationlogin.json';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👈 Eye icons

function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, data);
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      navigate(role === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#1e1e2f' }}>
      <div className="row w-100 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '1000px', backgroundColor: '#fff' }}>

        {/* Left Form Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <h3 className="mb-4 text-dark">Welcome Back 👋</h3>

          {errorMsg && (
            <div className="alert alert-danger py-2">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4 position-relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>

            <p className="mt-3 text-dark">
              New here? <Link to="/">Register</Link>
            </p>
          </form>
        </div>

        {/* Right Animation Section */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <Lottie animationData={animationData} style={{ height: '300px', width: '85%' }} />
        </div>

      </div>
    </div>
  );
}

export default Login;
