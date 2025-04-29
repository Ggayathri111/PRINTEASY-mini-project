import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
 // Adjust path as necessary

const Login = () => {
    const line = " https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app";
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${line}/login`, { username, password });
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            navigate("/home");
        } catch (error) {
            console.error(error);
            setToken(null);
            localStorage.removeItem("token");
        }
    };

    return (
        <div>
            <style>
                {`
                body {
                    font-family: 'Arial', sans-serif;
                    background-color:white; 
                    margin: 0; 
                    height: 100vh;
                    color: #333; 
                }

                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                .form-container {
                    background-color: white;
                    border-radius: 10px;
                    padding: 30px;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                  
                }

                h2 {
                    margin-bottom: 20px;
                    color: black; 
                    font-size: xx-large;
                    font-weight: bold;
                }

                input {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd; 
                    border-radius: 5px;
                    background-color: #f9f9f9; 
                    color: #333; 
                    transition: border-color 0.3s ease;
                }

                input::placeholder {
                    color: #aaa;
                }

                input:focus {
                    outline: none;
                    border-color: #3b71ca; 
                }

                button {
                    width: 100%;
                    padding: 12px;
                    background-color:black; 
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }

                button:hover {
                    background-color:white;
                    border-style:solid;
                    border-color:black;
                    border-width: thin; /* Change this to adjust thickness */
                    color:black; 
                    transform: translateY(-2px);
                }

                .signup {
                    color: #3b71ca; 
                    text-decoration: underline;
                    cursor: pointer;
                }

                /* Wiggle animation */
                @keyframes wiggle {
                  0%, 100% { transform: rotate(0deg); }
                  25% { transform: rotate(5deg); }
                  50% { transform: rotate(-5deg); }
                  75% { transform: rotate(3deg); }
                }

                .wiggle {
                  animation-name: wiggle;
                  animation-duration: 1s; /* Duration of the wiggle */
                  animation-timing-function: ease-in-out; /* Smoothness of the animation */
                  animation-iteration-count: 2; /* Repeat indefinitely */
                  animation-direction: alternate; /* Alternate direction on each iteration */
                }
                
                @media (max-width: 480px) {
                  .form-container {
                      padding: 20px;
                  }
                  h2 {
                      font-size: large;
                  }
                  button, input {
                      padding: 10px;
                  }
                }
                `}
            </style>
            <div className="container">
                <div className="form-container">
                    {/* Logo Image with wiggle effect */}
                    <img src='/images/quill.jpg' alt="Logo" className="wiggle" style={{ width: '80%', marginBottom: '20px', display:'block', marginLeft:'auto', marginRight:'auto' }} />
                    
                    <h2>Welcome</h2> 
                    <p>Please enter your login and password!</p>

                    <form id="loginForm" className="form active" onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <a href="/Signup" className="signup">Sign Up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

