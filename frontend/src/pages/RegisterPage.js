import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import "../styles/pages/register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        profilePicture: "",
        bio: ""
    });

    const [message, setMessage] = useState("");
    const { register, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target && e.target.name === 'username') {
            setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
        }
        else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }


    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await register(formData);
            console.log('status : ', res);
            setMessage(res.message);
            navigate('/');
        } catch (ex) {
            setMessage(error?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="auth-form-container">
                <h1 className="auth-title">Register</h1>
                {error && <div className="error-message">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profilePicture">Profile Picture URL</label>
                        <input
                            type="text"
                            id="profilePicture"
                            name="profilePicture"
                            placeholder="Profile Picture URL"
                            value={formData.profilePicture}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profilePicture">bio</label>
                        <input
                            type="text"
                            id="bio"
                            name="bio"
                            placeholder="Bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <input type="text" name="profilePicture" placeholder="Profile Picture URL" onChange={handleChange} /> */}
                    <button type="submit" className="auth-button">Register</button>
                    <button type="button" className="back-button" onClick={() => navigate("/login")}>
                        Back to Login
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Register;
