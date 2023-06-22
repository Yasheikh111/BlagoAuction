import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import "react-bootstrap";
import axios from "axios";
import OrganizationSearch from "../components/OrganizationSearch";
import {Card, Modal} from "react-bootstrap";



const TicketPage: React.FC = (props) => {

    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [orgId, setOrgId] = useState(0);
    const navigate = useNavigate();

    //popup
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');
    
    const handleClick = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/ticket', {
            requestedEmail:email,
            requestedName: firstname,
            requestedSurname: surname,
            requestedPassword: password,
            selectedOrgId: orgId,
            phone: phone
        })
            .then(response => {
                setPopUpText("Тікет створено.")
                setShowPopUp(true)
                let timeout = setTimeout(() => {
                    console.log("closed");
                    setShowPopUp(false)
                    setPopUpInterval(timeout)
                    clearTimeout(popUpInterval)
                },5000)
                return () => clearTimeout(timeout)
            })
            .catch(error => {
                console.log(error)});
    };

    return (
        <Card className="w-50 m-auto p-5 pt-1 shadow-xl shadow-inner-xl  justify-content-center align-content-center">
        <form onSubmit={handleClick}>
            <span className="text-center d-flex justify-content-center pt-5 pb-1 font-thin text-5xl text-dark">Форма реєстрації представника організації</span>
                    <Modal size="sm" centered className="m-auto" show={showPopUp} onHide={() => setShowPopUp(false)}>
                        <Modal.Header className="d-flex " closeButton>
                            <Modal.Title className="align-self-center ms-auto">Успіх</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-emerald-500  rounded-1">{popUpText}</Modal.Body>
                    </Modal>
                <span className="text-center text-muted d-flex justify-content-center p-2 font-thin text-xl text-dark-50">Вкажіть бажані дані</span>
                <div className="form-group d-flex flex-column">
                    <label htmlFor="firstname" className="text-black-75">
                        Ім'я
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required/>
                    <label htmlFor="surname" className="text-black-75">
                        Прізвище
                    </label>
                    <input
                        type="text"
                        id="surname"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required/>
                    <label htmlFor="phone" className="text-black-75">
                        Телефон
                    </label>
                    <input
                        type="text"
                        id="phone"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required/>
                    <label htmlFor="email" className="text-black-75">
                        Почта
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form-control p-2 align-self-center w-75 m-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                    <label htmlFor="password" className="text-black-75">
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
                <div className="w-100 d-flex justify-content-center me-auto ms-auto">
                    <OrganizationSearch setSelectedOrganization={setOrgId}></OrganizationSearch>
                </div>
                <div className="text-center m-1">
                    <button type="submit" className="btn btn-primary btn-lg">
                        Відправити
                    </button>
                </div>
        </form>
        </Card>
    );
};
export default TicketPage;