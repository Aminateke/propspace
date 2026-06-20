import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicFeed from './components/PublicFeed';
import { Login, Register } from './components/AuthForms';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <nav style={{ padding: '15px 20px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}><h1 style={{ margin: 0 }}>🏠 PropSpace</h1></Link>
                    <div>
                        <Link to="/" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Marketplace</Link>
                        <Link to="/login" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none', background: '#2e7d32', padding: '6px 12px', borderRadius: '4px' }}>Sign Up</Link>
                    </div>
                </nav>
                
                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<PublicFeed />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;