import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import Auth from './pages/Auth';
import './App.css';

function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null); // Stores Logged in User

    const handleLogout = () => {
        setIsAdmin(false);
        setUser(null);
    };

    return (
        <BrowserRouter>
            <Navbar isAdmin={isAdmin} user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/login" element={<Auth setUser={setUser} />} />
                <Route path="/admin" element={<AdminPage setAdminAuth={setIsAdmin} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;