// frontend/src/pages/Auth.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';
        try {
            const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, form);
            if (isLogin) {
                setUser(res.data.user);
                alert("Login Successful!");
                navigate('/');
            } else {
                alert(res.data.message);
                setIsLogin(true);
            }
        } catch (err) { alert(err.response?.data?.error || "Error"); }
    };

    return (
        // ADDED THIS WRAPPER div
        <div className="auth-container">
            <div className="center-box">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && <input placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} required />}
                    <input placeholder="Email Address" type="email" onChange={e => setForm({...form, email: e.target.value})} required />
                    <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} required />
                    <button className="primary-btn">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                <p onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer', color: '#4ca1af', marginTop: '15px', fontWeight: 'bold'}}>
                    {isLogin ? "New user? Register here" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
};
export default Auth;