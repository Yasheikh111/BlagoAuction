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
                    <label htmlFor="firstname" className="text-primary">
                        Ім'я
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required/>
                    <label htmlFor="surname" className="text-primary">
                        Прізвище
                    </label>
                    <input
                        type="text"
                        id="surname"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required/>
                    <label htmlFor="email" className="text-primary">
                        Почта
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
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
                    <button type="submit" className="btn btn-primary btn-lg">
                        Відправити
                    </button>
                </div>
            </form>
        </>
    );
};

export default SignUpForm;