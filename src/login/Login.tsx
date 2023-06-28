import React from "react";
import {useState, useEffect, useRef} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../components/hooks/useAuth";
import axios from "../service/api/axios";
import login_styles from './login.module.css';
import {FiMail} from 'react-icons/fi';
import {FiLock} from 'react-icons/fi';
import {FiUser} from 'react-icons/fi';
import {FiUnlock} from 'react-icons/fi';
import {FiEye} from 'react-icons/fi';
import {FiEyeOff} from 'react-icons/fi';
import {requestLogin} from "./api/methods/requestLogin";
import {LoginResponse} from "./api/requests/PostLoginRequest";
import {IAuth} from "../App/Layers/AuthProvider";

// const LOGIN_URL = '/auth/login';
const REGISTER_URL = '/auth/registration';

const Login = () => {
    const {setAuth, setIsAuthInProgress} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    // @ts-ignore
    const from = location.state?.from?.pathname || "/";

    const errRefLogin = useRef();
    const errRefReg = useRef();

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [errMsgRegistration, setErrMsgRegistration] = useState('');
    const [errMsgLogin, setErrMsgLogin] = useState('');

    useEffect(() => {
        setErrMsgRegistration('');
        setErrMsgLogin('');
    }, [userName, email, pwd, matchPwd, checkbox]);

    const [isPwShow, setActive] = useState(false);
    const clickEye = () => {
        setActive(!isPwShow);
    }

    const [isRegistrationFormShow, setActiveForm] = useState(false);
    const clickLoginOrRegistrationLink = () => {
        setActiveForm(!isRegistrationFormShow);
    }

    const handleRegistrationSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axios.post(REGISTER_URL,
                {
                    'first_name': userName,
                    'email': email,
                    'password': pwd,
                    'agreement_checkbox': checkbox
                }
            );
            if (response.data.error === null) {
                setActiveForm(false);
                console.log(response);
            }
            setUserName('');
            setEmail('');
            setPwd('');
            setMatchPwd('');
            setCheckbox(false);
        } catch (err) {
            if (!err?.response) {
                setErrMsgRegistration('Нет ответа от сервера');
            } else if (err.response?.status === 403) {
                setErrMsgRegistration("Пользователь уже существует")
            } else {
                setErrMsgRegistration('Registration Failed');
            }
        }
        e.target.reset();
    }

    const handleLoginSubmit = async (e: any) => {
        e.preventDefault();
        setIsAuthInProgress(true);
        try {
            const response = await requestLogin(email, pwd);
            if (response) {
                applyLoginResponse(response);
            }
        } catch (err) {
            console.log('handleLoginSubmit error', {err});
            if (!err.response) {
                setErrMsgLogin('Нет ответа от сервера');
            } else if (err.response?.status === 403) {
                setErrMsgLogin('Неверный логин пользователя или пароль');
            } else {
                setErrMsgLogin('Login Failed');
            }
            setIsAuthInProgress(false);
        }
    }

    const applyLoginResponse = (response: LoginResponse) => {
        const authObject: IAuth = {
            email,
            pwd,
            roles: response.role,
            accessToken: response.access_token,
            refreshToken: response.refresh_token
        };
        // save in context
        setAuth(authObject);
        navigate(from, {replace: true});
        // save in storage
        localStorage.setItem("token", response.access_token);
        localStorage.setItem('id', response.id);
        setIsAuthInProgress(false);
    }

    return (
        <header className={`${login_styles.header}`}>
            <div className={`${login_styles.container} ${isRegistrationFormShow ? login_styles.active : ""}`}>
                <div className={`${login_styles.forms}`}>
                    {/*login */}
                    <div className={`${login_styles.form} ${login_styles.login}`}>
                        <span className={`${login_styles.title}`}>Login</span>
                        <form className="loginForm" onSubmit={handleLoginSubmit}>
                            <div className={`${login_styles.input_field}`}>
                                <input className="login__email"
                                       type="email"
                                       placeholder="Enter your email"
                                       onChange={(e) => setEmail(e.target.value)}
                                       required/>
                                <i className={`${login_styles.icon}`}><FiMail/></i>
                            </div>
                            <div className={`${login_styles.input_field}`}>
                                <input type={isPwShow ? "password" : "text"}
                                       className="login__password password"
                                       placeholder="Enter password"
                                       onChange={(e) => setPwd(e.target.value)}
                                       required/>
                                <i className={`${login_styles.icon}`}><FiLock/></i>
                                <i className={`${login_styles.showHidePw}`} onClick={clickEye}>
                                    {isPwShow ? <FiEye/> : <FiEyeOff/>}</i>
                            </div>
                            <div className={`${login_styles.checkbox_text}`}>
                                <div className={`${login_styles.checkbox_content}`}>
                                    <input type="checkbox" id="logCheck"/>
                                    <label htmlFor="logCheck" className={`${login_styles.text}`}>Remember me</label>
                                </div>
                                <a href="src/login/Login#" className={`${login_styles.text}`}>Forgot password?</a>
                            </div>
                            <div className={`${login_styles.input_field} ${login_styles.button}`}>
                                <input type="submit" value="Login Now" className="loginButton"/>
                                <small ref={errRefLogin}
                                       className={errMsgLogin ? login_styles.errmsg : login_styles.offscreen}>{errMsgLogin}
                                </small>
                            </div>
                        </form>

                        <div className={`${login_styles.login_signup}`}>
                            <span className={`${login_styles.text}`}>Not a member?&nbsp;
                                <a className={`${login_styles.text} singup-link`}
                                   onClick={clickLoginOrRegistrationLink}>Registration now</a>
                            </span>
                        </div>
                    </div>

                    {/*Registration */}
                    <div className={`${login_styles.form} ${login_styles.signup}`}>
                        <span className={`${login_styles.title}`}>Registration</span>
                        <form className="registrationForm" onSubmit={handleRegistrationSubmit}>
                            <div className={`${login_styles.input_field}`}>
                                <input type="text"
                                       className="registration__name"
                                       placeholder="Enter your name"
                                       onChange={(e) => setUserName(e.target.value)}
                                       required/>
                                <i className={`${login_styles.icon}`}><FiUser/></i>
                            </div>
                            <div className={`${login_styles.input_field}`}>
                                <input type="email"
                                       className="registration__email"
                                       placeholder="Enter your email"
                                       onChange={(e) => setEmail(e.target.value)}
                                       required/>
                                <i className={`${login_styles.icon}`}><FiMail/></i>
                            </div>
                            <div className={`${login_styles.input_field}`}>
                                <input type={isPwShow ? "password" : "text"}
                                       className="registration__password password"
                                       placeholder="Create a password"
                                       onChange={(e) => setPwd(e.target.value)}
                                       required/>
                                <i className={`${login_styles.icon}`}><FiUnlock/></i>
                                <i className={`${login_styles.showHidePw}`} onClick={clickEye}>
                                    {isPwShow ? <FiEye/> : <FiEyeOff/>}</i>
                            </div>
                            <div className={`${login_styles.input_field}`}>
                                <input type={isPwShow ? "password" : "text"}
                                       className="registration__confirmPw password"
                                       placeholder="Confirm a password"
                                       onChange={(e) => setMatchPwd(e.target.value)}
                                       required/>
                                <i className={`${login_styles.icon}`}><FiLock/></i>
                            </div>
                            <div className={`${login_styles.checkbox_text}`}>
                                <div className={`${login_styles.checkbox_content}`}>
                                    <input type="checkbox"
                                           className="agreementCheckbox"
                                           onChange={(e) => setCheckbox(e.target.checked)}
                                           id="sigCheck"
                                           required/>
                                    <label htmlFor="sigCheck" className={`${login_styles.text}`}>I consent to the
                                        processing of personal data</label>
                                </div>
                            </div>
                            <div className={`${login_styles.input_field} ${login_styles.button}`}>
                                <input type="submit"
                                       value="Sing Up"
                                       className="registrationButton"/>
                                <small ref={errRefReg}
                                       className={errMsgRegistration ? login_styles.errmsg : login_styles.offscreen}>{errMsgRegistration}
                                </small>
                            </div>
                        </form>

                        <div className={`${login_styles.login_signup}`}>
                            <span className={`${login_styles.text}`}>Do you have an account?&nbsp;
                                <a className={`${login_styles.text} login-link`} onClick={clickLoginOrRegistrationLink}>SingIn now</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Login;