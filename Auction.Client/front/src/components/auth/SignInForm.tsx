import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import "react-bootstrap";
import axios from "axios";
import UserLogInCredentials from "../../models/UserLogInCredentials";
import User from "../../models/User";
import authUtils from "../../services/authUtils";
import {Modal} from "react-bootstrap";


export interface AuthProps {
    setIsAuthenticated: any
}

const SignInForm: React.FC<AuthProps> = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    //popup
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');
    
    
    if (authUtils.isUserAuthenticated())
        navigate("/");

    const handleClick = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/login', new UserLogInCredentials(email, password))
            .then(response => {
                let data = response.data;
                sessionStorage.setItem("user", JSON.stringify(data))
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                console.log('Logging in...', email, password);
                navigate("/")
                props.setIsAuthenticated(true)
                
            })
            .catch(error => {
                setPopUpText("Користувача за такими даними не знайдено.")
                setShowPopUp(true)
                let timeout = setTimeout(() => {
                    console.log("closed");
                    setShowPopUp(false)
                    setPopUpInterval(timeout)
                    clearTimeout(popUpInterval)
                },5000)});

    };

    return (
        <form className="pt-0 mt-0" onSubmit={handleClick}>
            <Modal size="sm" centered className="m-auto" show={showPopUp} onHide={() => setShowPopUp(false)}>
                <Modal.Header className="d-flex " closeButton>
                    <Modal.Title className="align-self-center ms-auto">Помилка авторизації</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-red-500  rounded-1">{popUpText}</Modal.Body>
            </Modal>
            <span className="text-center justify-content-center pb-5 mb-5 font-thin text-5xl text-dark">Вхід</span>
            <div className="form-group pt-5 d-flex flex-column">
                <label htmlFor="email" className="text-primary">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    className="form-control p-2 align-self-center w-75 m-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
            </div>
            <div className="form-group d-flex flex-column">
                <label htmlFor="password" className="text-primary">
                    Пароль
                </label>
                <input
                    type="password"
                    id="password"
                    className="form-control p-2 align-self-center w-75 m-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg btn-primary">
                    Ввійти
                </button>
            </div>
        </form>

    );
};

export default SignInForm;