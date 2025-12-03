import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
    const [trains, setTrains] = useState([]);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const navigate = useNavigate();

    // 1. LOAD TRAINS ON STARTUP
    useEffect(() => {
        fetchTrains();
    }, []);

    const fetchTrains = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/trains');
            setTrains(res.data);
            
            // If a train was already selected, refresh its data (to update booked seats in real-time)
            if (selectedTrain) {
                const updated = res.data.find(t => t._id === selectedTrain._id);
                if (updated) setSelectedTrain(updated);
            }
        } catch (err) {
            console.error("Error fetching trains", err);
        }
    };

    // 2. BOOKING LOGIC
    const bookSeat = async (seatNum) => {
        // Security Check: Is user logged in?
        if (!user) {
            const confirmLogin = window.confirm("You must login to book tickets. Go to login page?");
            if (confirmLogin) navigate('/login');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/trains/book', {
                trainId: selectedTrain._id,
                seatNumber: seatNum,
                passenger: user.name
            });
            alert(`Success! Seat ${seatNum} confirmed for ${user.name}.`);
            
            // Refresh data to turn the seat RED immediately
            fetchTrains(); 
        } catch (err) {
            alert(err.response?.data?.error || "Booking Failed");
        }
    };

    return (
        <div className="home-container">
            {/* --- LEFT PANEL: SIDEBAR --- */}
            <div className="sidebar">
                <h3>Available Trains</h3>
                {trains.length === 0 ? <p style={{padding: '10px'}}>Loading schedules...</p> : null}
                
                {trains.map(train => {
                    // Logic: Count available seats
                    const availableCount = train.seats.filter(s => !s.isBooked).length;
                    const isFull = availableCount === 0;

                    return (
                        <div 
                            key={train._id} 
                            onClick={() => setSelectedTrain(train)} 
                            className={`train-card ${selectedTrain?._id === train._id ? 'active' : ''}`}
                        >
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <h4>{train.name}</h4>
                                <span style={{fontSize:'0.8rem', color:'#7f8c8d'}}>{train.departureTime || '10:00 AM'}</span>
                            </div>
                            
                            <p style={{margin: '5px 0', fontSize:'0.9rem', color:'#555'}}>
                                {train.source} <span style={{color:'#4ca1af'}}>➔</span> {train.dest}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems:'center' }}>
                                <span className="price">${train.price}</span>
                                
                                {/* Badge Logic: Green if Available, Red if Full */}
                                <span style={{ 
                                    background: isFull ? '#ffebee' : '#e8f5e9',
                                    color: isFull ? '#c62828' : '#2e7d32',
                                    padding: '3px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    {isFull ? "SOLD OUT" : `${availableCount} Seats`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* --- RIGHT PANEL: MAIN AREA --- */}
            <div className="booking-area">
                {selectedTrain ? (
                    /* STATE A: TRAIN IS SELECTED -> SHOW SEATS */
                    <>
                        <div style={{borderBottom:'1px solid #eee', paddingBottom:'10px', width:'100%', marginBottom:'20px'}}>
                            <h2 style={{margin:0, color:'#2c3e50'}}>{selectedTrain.name} Booking</h2>
                            <p style={{margin:'5px 0', color:'#7f8c8d'}}>
                                Booking as: <strong>{user ? user.name : "Guest (Login required)"}</strong>
                            </p>
                        </div>

                        {/* Visual Legend */}
                        <div style={{display:'flex', gap:'20px', marginBottom:'20px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                <div style={{width:'15px', height:'15px', background:'#27ae60', borderRadius:'3px'}}></div> Available
                            </div>
                            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                <div style={{width:'15px', height:'15px', background:'#e74c3c', borderRadius:'3px'}}></div> Booked
                            </div>
                        </div>

                        {/* Seat Grid */}
                        <div className="seat-grid">
                            {selectedTrain.seats.map(seat => (
                                <button
                                    key={seat.number}
                                    disabled={seat.isBooked}
                                    onClick={() => bookSeat(seat.number)}
                                    className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
                                    title={seat.isBooked ? "Occupied" : `Book Seat ${seat.number}`}
                                >
                                    {seat.number}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    /* STATE B: NO TRAIN SELECTED -> SHOW HERO WELCOME */
                    <div className="placeholder-content">
                        <span className="placeholder-icon">🚆</span>
                        <h2>Welcome to RailConnect</h2>
                        <p>Your journey begins here. Select a train from the list to view real-time availability.</p>
                        <div style={{marginTop:'30px', display:'flex', gap:'20px', justifyContent:'center'}}>
                            <div>✅ Instant Booking</div>
                            <div>🔒 Secure Payment</div>
                            <div>🎫 E-Tickets</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;