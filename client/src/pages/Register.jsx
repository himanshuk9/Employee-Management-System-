import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../svg/animation.json';

function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' }); // clear on change
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, data);
      setMessage({ type: 'success', text: '✅ Registered Successfully!' });

      setTimeout(() => {
        navigate('/login');
      }, 1500); // navigate after showing message
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Something went wrong' });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#1e1e2f' }}>
      <div className="row w-100 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '1000px', backgroundColor: '#fff' }}>

        {/* Left Form Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <h3 className="mb-4 text-dark">Create Account</h3>

          {/* Show message */}
          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                name="name"
                className="form-control"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="mb-4">
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            <p className="mt-3 text-dark">
              Already registered? <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>

        {/* Right Animation Section */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <Lottie animationData={animationData} style={{ height: '500px', width: '100%' }} />
        </div>

      </div>
    </div>
  );
}

export default Register;
