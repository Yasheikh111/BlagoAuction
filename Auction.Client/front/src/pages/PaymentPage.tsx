import React, {useEffect, useState} from 'react';
import {Button, Form, Image, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LotService from "../services/LotService";
import lotService from "../services/LotService";
import moment from "moment";
import User from "../models/User";
import authUtils from "../services/authUtils";
const PaymentPage = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');


    const [amount, setAmount] = useState(50);

    const [responseData,setResponseData] = useState("");
    const [responseKey,setResponseKey] = useState("");
    const [showPay, setShowPay] = useState(false);


    const handleFormSubmit = ()  => {

        let s = LotService.GetService();
        s.axios.post("http://localhost:8080/api/payment/",{amount: amount}).then(res => {
                    setResponseData(res.data.data);
                    setResponseKey(res.data.signature);
                    setShowPay(!showPay);
                    // setPopUpText("Лот додано!")
                    // setShowPopUp(true)
                    // let timeout = setTimeout(() => {
                    //     console.log("closed");
                    //     setShowPopUp(false)
                    //     setPopUpInterval(timeout)
                    //     clearTimeout(popUpInterval)
                    // },500)
                }).catch(e => {
                    console.log("ua")
                    // setPopUpText(e)
                    // setShowPopUp(true)
                    // let timeout = setTimeout(() => {
                    //     console.log("closed");
                    //     setShowPopUp(false)
                    //     setPopUpInterval(timeout)
                    //     clearTimeout(popUpInterval)
                    // },500)
                })
        // setDescription('');
        // setTarget('');
        // setMinBet('');
        // setBetStep('');
        // setStartDate('');
        // setEndDate('');
        // setImages('');
    };


    return (
        <div className="d-flex flex-column mt-auto mb-auto align-content-center">
            <span className="text-center d-flex justify-content-center mb-5 font-thin text-5xl text-dark">Поповнення рахунку</span>
            <Form className=" flex-wrap d-flex flex-column align-content-center w-100 justify-content-center align-content-center " onSubmit={handleFormSubmit}>
                <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{popUpText}</Modal.Body>
                </Modal>
                <div>
                    <Form.Label>Поповненя в грн:</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        required
                    />
                </div>
                <Button onClick={handleFormSubmit}>Сформувати оплату</Button>
            </Form>
            <form method="POST" className="pt-5" hidden={!showPay} action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
                <input type="hidden" name="data" value={responseData}/>
                <input type="hidden" name="signature" value={responseKey}/>
                <p>Для оплати нажміть:</p>
                <input type="image" src="//static.liqpay.ua/buttons/p1ru.radius.png" alt=""/>
            </form>
        </div>
    );
};

export default PaymentPage;