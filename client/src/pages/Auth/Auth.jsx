import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "./Auth.css";
import icon from '../../assets/icon.png';
import Aboutauth from './Aboutauth';
import { signup, login } from '../../action/auth';

const Auth = () => {
    const [issignup, setissignup] = useState(false);
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("⚠️ Please enter both email and password.");
            return;
        }
        if (issignup && !name) {
            alert("⚠️ Please enter a display name.");
            return;
        }

        try {
            if (issignup) {
                const response = await dispatch(signup({ name, email, password }, navigate));
                if (response.success) {
                    alert("✅ Signup successful! You can now log in.");
                } else if (response.message.includes("already exists")) {
                    alert("❌ User already exists. Please log in.");
                } else {
                    alert(`❌ ${response.message}`);
                }
            } else {
                const response = await dispatch(login({ email, password }, navigate));
                if (response.success) {
                    alert("✅ Login successful!");
                } else if (response.message.includes("Incorrect password")) {
                    alert("❌ Incorrect password. Please try again.");
                } else if (response.message.includes("User not found")) {
                    alert("❌ User not found. Please check your email or sign up.");
                } else {
                    alert(`❌ ${response.message}`);
                }
            }
        } catch (error) {
            alert("❌ An error occurred. Please try again.");
        }
    };

    const handleswitch = () => {
        setissignup(!issignup);
        setname("");
        setemail("");
        setpassword("");
    };

    return (
        <section className="auth-section">
            {issignup && <Aboutauth />}
            <div className="auth-container-2">
                <img src={icon} alt="icon" className='login-logo' />
                <form onSubmit={handlesubmit}>
                    {issignup && (
                        <label htmlFor="name">
                            <h4>Display Name</h4>
                            <input
                                type="text"
                                id='name'
                                name='name'
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                            />
                        </label>
                    )}
                    <label htmlFor="email">
                        <h4>Email</h4>
                        <input
                            type="email"
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </label>
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>Password</h4>
                            {!issignup && (
                                <p style={{ color: "#007ac6", fontSize: "13px" }}>
                                    Forgot Password?
                                </p>
                            )}
                        </div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </label>
                    <button type='submit' className='auth-btn'>
                        {issignup ? "Sign up" : "Log in"}
                    </button>
                </form>
                <p>
                    {issignup ? "Already have an account?" : "Don't have an account?"}
                    <button type='button' className='handle-switch-btn' onClick={handleswitch}>
                        {issignup ? "Log in" : "Sign up"}
                    </button>
                </p>
            </div>
        </section>
    );
};

export default Auth;
