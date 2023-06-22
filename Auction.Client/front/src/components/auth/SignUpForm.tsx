import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import UserSignUp from "../../models/UserSignUp";
import authUtils from "../../services/authUtils";
import {Modal} from "react-bootstrap";

const SignUpForm: React.FC = (props) => {
    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    //popup
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');
    
    if (authUtils.isUserAuthenticated())
        navigate("/");
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/signup',new UserSignUp(firstname,surname,email,password))
            .then(response => {
                navigate("/login")
            })
            .catch(error => {
                setPopUpText("Такий користувач вже існує.")
                setShowPopUp(true)
                let timeout = setTimeout(() => {
                    console.log("closed");
                    setShowPopUp(false)
                    setPopUpInterval(timeout)
                    clearTimeout(popUpInterval)
                },5000)
                return () => clearTimeout(timeout)
            });
        console.log('Signing up...', email, password,firstname,surname);

    };

    return (
        <>
            <Modal size="sm" centered className="m-auto" show={showPopUp} onHide={() => setShowPopUp(false)}>
                <Modal.Header className="d-flex " closeButton>
                    <Modal.Title className="align-self-center ms-auto">Помилка!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-red-500  rounded-1">{popUpText}</Modal.Body>
            </Modal>
            <span className="text-center justify-content-center pb-5 font-thin text-5xl text-dark">Реєстрація</span>
            <form onSubmit={handleLogin}>
                <div className="form-group d-flex flex-column">
                    <input
                        type="text"
                        id="firstname"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={firstname}
                        placeholder={"Ім`я"}
                        onChange={(e) => setFirstname(e.target.value)}
                        required/>
                    <input
                        type="text"
                        id="surname"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={surname}
                        placeholder={"Прізвище"}
                        onChange={(e) => setSurname(e.target.value)}
                        required/>
                    <input
                        type="email"
                        id="email"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={email}
                        placeholder={"Email"}
                        
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                    <input
                        type="password"
                        id="password"
                        placeholder={"Пароль"}
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                </div>

                <div className="d-flex flex-col text-center">
                    <button type="submit" className="btn w-50 mt-4 align-self-center btn-primary btn-lg">
                        Відправити
                    </button>
                    <a onClick={() => navigate("/")} className="mt-2 underline-offset-2 underline">Назад</a>
                    
                </div>
            </form>
        </>
    );
};

export default SignUpForm;