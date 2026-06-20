import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user, apiRequest, logout } = useContext(AuthContext);
    const [myProperties, setMyProperties] = useState([]);
    
    // Portfolio & Profile Configuration States
    const [formData, setFormData] = useState({ title: '', description: '', price: '', location: '', propertyType: 'Apartment' });
    const [profileData, setProfileData] = useState({ username: user?.username || '', phone: '', avatar: '', oldPassword: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const [profileMessage, setProfileMessage] = useState('');

    const fetchMyListings = async () => {
        try {
            const res = await apiRequest('/properties/my-listings');
            const data = await res.json();
            if (res.ok) setMyProperties(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await apiRequest('/properties', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setMessage('Listing created successfully!');
                fetchMyListings();
                setFormData({ title: '', description: '', price: '', location: '', propertyType: 'Apartment' });
            }
        } catch (err) {
            setMessage('Failed to create listing');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            const res = await apiRequest(`/properties/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMyProperties(myProperties.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        try {
            const res = await apiRequest('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (res.ok) {
                setProfileMessage('Profile settings updated completely!');
                setProfileData({ ...profileData, oldPassword: '', newPassword: '' });
            } else {
                setProfileMessage(data.message || 'Profile modification error');
            }
        } catch (err) {
            setProfileMessage('Failed to save profile alterations');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <h2>Welcome, {user?.username}! ⚙️ Account Management Dashboard</h2>
                <button onClick={logout} style={{ padding: '8px 15px', background: '#d32f2f', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                {/* Profile Metrics Read/Write UI */}
                <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
                    <h3>👤 Personal Configuration Metrics</h3>
                    {profileMessage && <p style={{ color: 'magenta' }}>{profileMessage}</p>}
                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" placeholder="Change profile name" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="Contact phone number" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="Upload avatar link" value={profileData.avatar} onChange={e => setProfileData({...profileData, avatar: e.target.value})} style={{ padding: '8px' }} />
                        <hr/>
                        <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>Security Adjustments:</p>
                        <input type="password" placeholder="Verify Old Password" value={profileData.oldPassword} onChange={e => setProfileData({...profileData, oldPassword: e.target.value})} style={{ padding: '8px' }} />
                        <input type="password" placeholder="New Secure Password" value={profileData.newPassword} onChange={e => setProfileData({...profileData, newPassword: e.target.value})} style={{ padding: '8px' }} />
                        <button type="submit" style={{ padding: '8px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Settings</button>
                    </form>
                </div>

                {/* Create Property Listing Form */}
                <div>
                    <h3>➕ Create Property Listing</h3>
                    {message && <p style={{ color: 'blue' }}>{message}</p>}
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" placeholder="Property Title" value={formData.title} required onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '8px' }} />
                        <textarea placeholder="Detailed Description" value={formData.description} required onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '8px' }} />
                        <input type="number" placeholder="Price ($)" value={formData.price} required onChange={e => setFormData({...formData, price: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="Location City" value={formData.location} required onChange={e => setFormData({...formData, location: e.target.value})} style={{ padding: '8px' }} />
                        <select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})} style={{ padding: '8px' }}>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Studio">Studio</option>
                        </select>
                        <button type="submit" style={{ padding: '10px', background: '#2e7d32', color: '#fff', border: 'none', cursor: 'pointer' }}>Publish Listing</button>
                    </form>
                </div>
            </div>

            {/* Dedicated Private Feed Display */}
            <div style={{ marginTop: '30px' }}>
                <h3>🏡 Your Private Portfolio Feed</h3>
                {myProperties.length === 0 ? <p>You have zero marketplace listings authored.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {myProperties.map(p => (
                            <div key={p._id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4>{p.title}</h4>
                                    <p>{p.location} — ${p.price}</p>
                                </div>
                                <button onClick={() => handleDelete(p._id)} style={{ padding: '6px 12px', background: '#c62828', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Remove</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;