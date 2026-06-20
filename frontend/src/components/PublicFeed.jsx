import { useState, useEffect } from 'react';

const PublicFeed = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Runs network requests exactly once during component mount
    useEffect(() => {
        fetch('http://localhost:5000/api/properties')
            .then(res => {
                if (!res.ok) throw new Error('Could not retrieve public marketplace data.');
                return res.json();
            })
            .then(data => {
                setProperties(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Asynchronous UX State Handlers for explicit feedback
    if (loading) return <h2 style={{ padding: '20px', color: '#0066cc' }}>🔄 Loading matching listings...</h2>;
    if (error) return <h2 style={{ padding: '20px', color: '#cc0000' }}>⚠️ Network Error Encountered: {error}</h2>;
    if (properties.length === 0) return <h2 style={{ padding: '20px', color: '#666' }}>📋 Empty Results: No items listed yet.</h2>;

    return (
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {properties.map(item => (
                <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>{item.title}</h3>
                    <p style={{ color: '#555' }}>{item.propertyType} • {item.location}</p>
                    <strong style={{ color: '#2e7d32', fontSize: '1.2em' }}>${item.price}</strong>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    );
};

export default PublicFeed;