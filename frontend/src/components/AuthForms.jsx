import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const { login, apiRequest } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', color: '#333' }}>
            <h2>Login to PropSpace</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '10px' }} />
                <input type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '10px' }} />
                <button type="submit" style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>Login</button>
            </form>
        </div>
    );
};

export const Register = () => {
    const { login, apiRequest } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', color: '#333' }}>
            <h2>Create an Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Username" required onChange={e => setFormData({...formData, username: e.target.value})} style={{ padding: '10px' }} />
                <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '10px' }} />
                <input type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '10px' }} />
                <button type="submit" style={{ padding: '10px', background: '#2e7d32', color: '#fff', border: 'none', cursor: 'pointer' }}>Register</button>
            </form>
        </div>
    );
};