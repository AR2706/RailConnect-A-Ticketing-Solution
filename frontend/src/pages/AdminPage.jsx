import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = ({ setAdminAuth }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [creds, setCreds] = useState({ username: '', password: '' });
    
    // Data State
    const [trains, setTrains] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({ name: '', source: '', dest: '', price: '', departureTime: '' });
    const [editId, setEditId] = useState(null); // If null -> Add Mode. If ID -> Edit Mode

    // --- 1. LOGIN LOGIC ---
    const login = async (e) => {
        e.preventDefault(); // Prevent reload
        try {
            await axios.post('http://localhost:5000/api/admin/login', creds);
            setIsLoggedIn(true);
            setAdminAuth(true);
            fetchTrains(); // Load data immediately after login
        } catch { alert('Invalid Credentials'); }
    };

    // --- 2. DATA FETCHING ---
    const fetchTrains = async () => {
        const res = await axios.get('http://localhost:5000/api/trains');
        setTrains(res.data);
    };

    // --- 3. CRUD OPERATIONS ---
    
    // Handle Submit (Both Add and Update)
    const handleSubmit = async () => {
        try {
            if (editId) {
                // UPDATE EXISTING
                await axios.put(`http://localhost:5000/api/trains/${editId}`, formData);
                alert('Train Updated Successfully!');
                setEditId(null); // Exit Edit Mode
            } else {
                // CREATE NEW
                await axios.post('http://localhost:5000/api/trains', formData);
                alert('Train Scheduled Successfully!');
            }
            
            // Reset Form & Refresh List
            setFormData({ name: '', source: '', dest: '', price: '', departureTime: '' });
            fetchTrains();
        } catch (err) { alert("Operation Failed"); }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this train?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/trains/${id}`);
            fetchTrains(); // Refresh List
        } catch (err) { alert("Delete Failed"); }
    };

    // Handle Edit Click (Populate Form)
    const startEdit = (train) => {
        setEditId(train._id);
        setFormData({
            name: train.name,
            source: train.source,
            dest: train.dest,
            price: train.price,
            departureTime: train.departureTime
        });
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- RENDER: LOGIN SCREEN ---
    if (!isLoggedIn) return (
        <div className="auth-container">
            <div className="center-box">
                <h2>Admin Portal</h2>
                <form onSubmit={login}>
                    <input placeholder="Username" onChange={e => setCreds({...creds, username: e.target.value})} />
                    <input type="password" placeholder="Password" onChange={e => setCreds({...creds, password: e.target.value})} />
                    <button className="primary-btn">Access Dashboard</button>
                </form>
            </div>
        </div>
    );

    // --- RENDER: DASHBOARD ---
    return (
        <div className="home-container" style={{display:'block'}}> {/* Block display for vertical stacking */}
            
            {/* FORM SECTION */}
            <div className="center-box wide" style={{marginBottom: '30px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>{editId ? '✏️ Edit Schedule' : '🗓️ Schedule New Train'}</h2>
                    {editId && <button onClick={() => {setEditId(null); setFormData({ name: '', source: '', dest: '', price: '', departureTime: '' })}} style={{background:'gray', border:'none', color:'white', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>Cancel Edit</button>}
                </div>

                <div className="form-grid">
                    <input placeholder="Train Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input placeholder="Source" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} />
                    <input placeholder="Destination" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} />
                    <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    <input type="time" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} />
                </div>
                <button 
                    className="primary-btn" 
                    onClick={handleSubmit}
                    style={{background: editId ? '#f39c12' : '#27ae60'}} // Orange for Edit, Green for Add
                >
                    {editId ? 'Update Schedule' : 'Publish Schedule'}
                </button>
            </div>

            {/* LIST SECTION */}
            <h3 style={{textAlign:'center', color:'#2c3e50'}}>Current Schedule Management</h3>
            <div style={{maxWidth:'800px', margin:'0 auto'}}>
                {trains.map(t => (
                    <div key={t._id} className="train-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'default'}}>
                        <div>
                            <h4 style={{margin:0}}>{t.name}</h4>
                            <small>{t.source} ➔ {t.dest} | {t.departureTime}</small>
                        </div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <button 
                                onClick={() => startEdit(t)}
                                style={{background:'#3498db', color:'white', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer'}}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(t._id)}
                                style={{background:'#e74c3c', color:'white', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer'}}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;