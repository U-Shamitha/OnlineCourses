import React, { useState } from 'react';

import './css/UserProfile.css'
import YourCourses from './YourCourses';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

    const navigate = useNavigate();

    // Function to handle profile updates
    const handleUpdateProfile = () => {
        navigate('/updateProfile');
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    }

    return (
        <div className="user-profile">
            {user ?
            <>
                <div className='personal-details'>
                    <img width="100%" src='/avatar.jpg' />
                    <div>
                        <h3>Your Details</h3>
                        <div>
                            <label>Name: </label>
                            <span>{user.name}</span>
                        </div>
                        <div>
                            <label>Email: </label>
                            <span>{user.email}</span>
                        </div>
                        {/* Add more user details here */}
                        <button onClick={handleLogout}>LogOut</button>
                        <button onClick={handleUpdateProfile}><FontAwesomeIcon icon={faEdit}/></button>
                        {/* <button onClick={() => handleUpdateProfile({ ...user, email: 'new.email@example.com' })}>
        Update Email
      </button> */}
                    </div>
                </div>
                <div className='user-courses'>
                    <YourCourses userId={user._id}/>
                </div>
            </>
                : <h1>Login in to view your details</h1>}
        </div>
    );
};

export default UserProfile;
