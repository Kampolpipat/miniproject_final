import React, { useState, useEffect } from 'react'
import './Auth.css'
import Logo from '../../../img/D.DasLogo.png' // ตรวจสอบว่าไฟล์ชื่อ D.DasLogo.png หรือ D.Daslogo.png
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logIn, signUp } from '../../../actions/AuthAction'
import { forgotPassword, resetPassword } from '../../../api/AuthRequest'

// OWASP Top 10:
// - A1: Input Validation (ตรวจสอบข้อมูลใน handleSubmit)
// - A2: Authentication (จัดการ token, redirect หลังผ่าน auth)
// - A3: Sensitive Data Exposure (ไม่เก็บ password ใน client state/sync)
// - A8: CSRF (ถ้าใช้ cookie-based auth ต้องมี CSRF token; ปัจจุบันใช้ token ใน localStorage)

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { authData, loading, error, errorMessage } = useSelector((state) => state.authReducer)

    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmpass: ""
    })

    const [confirmPass, setConfirmPass] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [resetResponse, setResetResponse] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [statusType, setStatusType] = useState('error');

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        if (error) {
            dispatch({ type: 'AUTH_RESET_ERROR' });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg('');

        if (isForgot) {
            return;
        }

        if (isSignUp) {
            if (!data.firstname || !data.lastname || !data.username || !data.email || !data.password || !data.confirmpass) {
                setStatusMsg('กรุณากรอกข้อมูลให้ครบทุกช่อง');
                setStatusType('error');
                return;
            }

            if (data.password !== data.confirmpass) {
                setConfirmPass(false);
                setStatusMsg('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
                setStatusType('error');
                return;
            }

            setConfirmPass(true);
            try {
                await dispatch(signUp(data));
                // after successful signup, redirect effect triggers
            } catch (error) {
                setStatusMsg(error?.message || 'Signup failed');
                setStatusType('error');
            }
        } else {
            if (!data.username || !data.password) {
                setStatusMsg('กรุณากรอก username/email และ password');
                setStatusType('error');
                return;
            }

            try {
                await dispatch(logIn(data));
            } catch (error) {
                setStatusMsg(error?.message || 'Login failed');
                setStatusType('error');
            }
        }
    };

    const handleForgot = async () => {
        if (!data.username) return;
        try {
            const res = await forgotPassword(data.username);
            setResetResponse(res.data?.message || 'Reset token sent');
            setResetToken(res.data?.resetToken || '');
        } catch (err) {
            setResetResponse(err?.response?.data?.message || 'Cannot process forgot request');
        }
    };

    const handleReset = async () => {
        if (!resetToken || !data.password) return;
        try {
            const res = await resetPassword({ token: resetToken, password: data.password });
            setResetResponse(res.data?.message || 'Password reset successfully');
        } catch (err) {
            setResetResponse(err?.response?.data?.message || 'Reset failed');
        }
    };

    const resetForm = () => {
        setConfirmPass(true);
        setStatusMsg('');
        setStatusType('error');
        setData({
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            confirmpass: ""
        });
    };

    useEffect(() => {
        const hasToken = !!authData?.token || !!JSON.parse(localStorage.getItem('profile'))?.token
        if (hasToken && window.location.pathname !== '/home') {
            navigate('/home')
        }
    }, [authData, navigate]);

    return (
        <div className="Auth">
            <div className="a-left">
                <img src={Logo} alt="Logo" />
                <div className="Webname">
                    <h1>D.Das Social</h1>
                    <h6>เปิดโลกกว้าง ค้นพบแรงบันดาลใจใหม่ๆ ไปด้วยกัน</h6>
                </div>
            </div>

            <div className="a-right">
                <form className="infoForm authForm" onSubmit={handleSubmit}>
                    <h3>{isSignUp ? "Sign Up" : "Log In"}</h3>

                    {isSignUp &&
                        <>
                            <div>
                                <input type="text"
                                    placeholder='First Name'
                                    className='infoInput'
                                    name='firstname'
                                    onChange={handleChange}
                                    value={data.firstname}
                                />
                                <input type="text"
                                    placeholder='Last Name'
                                    className='infoInput'
                                    name='lastname'
                                    onChange={handleChange}
                                    value={data.lastname}
                                />
                            </div>
                            <div>
                                <input type="email"
                                    className='infoInput'
                                    name='email'
                                    placeholder='Email'
                                    onChange={handleChange}
                                    value={data.email}
                                />
                            </div>
                        </>}

                    <div>
                        <input type="text"
                            className='infoInput'
                            name='username'
                            placeholder='Username or Email'
                            onChange={handleChange}
                            value={data.username}
                        />
                    </div>

                    <div>
                        <input type="password"
                            className='infoInput'
                            name='password'
                            placeholder='Password'
                            onChange={handleChange}
                            value={data.password}
                        />
                        {isSignUp && <input type="password"
                            className='infoInput'
                            name='confirmpass'
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            value={data.confirmpass}
                        />}
                    </div>

                    <span style={{ display: confirmPass ? "none" : "block", color: 'red', fontSize: '12px', alignSelf: "flex-end", marginRight: "5px" }} >
                        * Confirm Password is not same
                    </span>

                    <div>
                        <span
                            style={{ fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => { setIsSignUp((prev) => !prev); setIsForgot(false); resetForm(); dispatch({ type: 'AUTH_RESET_ERROR' }); }}
                        >
                            {isSignUp ? "Already have an account. Login!" : "Don't have an account? Sign Up"}
                        </span>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <span
                            style={{ fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => { setIsForgot((prev) => !prev); setResetResponse(''); }}
                        >
                            {isForgot ? "Back to Sign In" : "Forgot password?"}
                        </span>
                    </div>

                    {isForgot && (
                        <div style={{ marginTop: 10 }}>
                            <input
                                type="text"
                                className='infoInput'
                                name='username'
                                placeholder='Enter username for reset'
                                value={data.username}
                                onChange={handleChange}
                            />
                            <button type="button" className="button infoButton" onClick={handleForgot}>
                                Send Reset Link
                            </button>
                            <input
                                type="text"
                                className='infoInput'
                                placeholder='Reset token'
                                value={resetToken}
                                onChange={(e) => setResetToken(e.target.value)}
                            />
                            <input
                                type="password"
                                className='infoInput'
                                placeholder='New password'
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                            <button type="button" className="button infoButton" onClick={handleReset}>
                                Reset Password
                            </button>
                            {resetResponse && <p style={{ color: 'green', fontSize: '12px' }}>{resetResponse}</p>}
                        </div>
                    )}

                    {(statusMsg || error) && (
                        <p style={{ color: statusType === 'success' ? 'green' : 'red', marginTop: '10px', fontSize: '13px' }}>
                            {statusMsg || errorMessage || 'Authentication failed. กรุณาลองใหม่อีกครั้ง'}
                        </p>
                    )}
                    <button className="button infoButton" type='submit' disabled={loading || isForgot}>
                        {loading ? 'Please wait...' : isSignUp ? 'Signup' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;