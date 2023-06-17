import React, {useEffect, useState} from 'react';
import {Button, Form, Image, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LotService from "../services/LotService";
import moment from "moment";
import {convertFileToBase64} from "../services/ImageUtils";
import User from "../models/User";
import authUtils from "../services/authUtils";
import {useNavigate} from "react-router-dom";
import SearchComponent from "../components/OrganizationSearch";
import user from "../models/User";
const LotCreationForm = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');


    const [description, setDescription] = useState('');
    const [target, setTarget] = useState('');
    const [minBet, setMinBet] = useState('');
    const [betStep, setBetStep] = useState('');

    const [startDate, setStartDate] = useState<any>();
    const [startTime, setStartTime] = useState<any>();
    const [timeToBeatBet, setTimeToBeatBet] = useState<any>();
    
    const nav = useNavigate();

    const [endDate, setEndDate] = useState<any>();
    const [organizationId,setOrganizationId ] = useState<Number>(0);
    
    const [endTime, setEndTime] = useState<any>();

    const [image, setImages] = useState<any>();

    const handleFormSubmit = ()  => {

        let s = LotService.GetService();

        convertFileToBase64(image)
            .then((image64) => {
                let im = image64 as string;
                let momentStart = moment(startDate + startTime, 'YYYY-MM-DDLT');
                let momentEnd = moment(endDate + endTime, 'YYYY-MM-DDLT');


                s.axios.post(s.apiPath + "add/",{
                    description: description,
                    target: target,
                    minBet: minBet,
                    betStep: betStep,
                    image: im.split(",",2)[1],
                    startTime: momentStart.valueOf() + 1000 * 60 * 60 * 3,
                    endTime: momentEnd.valueOf() + 1000 * 60 * 60 * 3,
                    organizationId: organizationId,
                    secondsToBeatPrevBet : timeToBeatBet
                }).then(res => {
                    setPopUpText("Лот додано!")
                    setShowPopUp(true)
                    let timeout = setTimeout(() => {
                        console.log("closed");
                        setShowPopUp(false)
                        setPopUpInterval(timeout)
                        clearTimeout(popUpInterval)
                        nav("/lots")
                    },2000)
                }).catch(e => {
                    setPopUpText(e)
                    setShowPopUp(true)
                    let timeout = setTimeout(() => {
                        console.log("closed");
                        setShowPopUp(false)
                        setPopUpInterval(timeout)
                        clearTimeout(popUpInterval)
                    },500)
                })
            })
        // setDescription('');
        // setTarget('');
        // setMinBet('');
        // setBetStep('');
        // setStartDate('');
        // setEndDate('');
        // setImages('');
    };

    useEffect(() => {
        if(!User.validatedRole(authUtils.getUser(),"Admin") &&
            !User.validatedRole(authUtils.getUser(),"Moderator")){
            nav("/")
        }
    })


    return (
        <div className="align-content-center ms-auto me-auto p-4 bg-white rounded-4 w-50 justify-content-center">
            <h2 className="display-6 align-self-center">Створення аукціону</h2>
            <Form className="column d-flex align-content-center justify-content-center flex-column " onSubmit={handleFormSubmit}>
                <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{popUpText}</Modal.Body>
                    </Modal>
                { !User.validatedRole(authUtils.getUser(),"Moderator") ? 
                <SearchComponent setSelectedOrganization={setOrganizationId}/> : null
                }
                    <div>
                    <Form.Label>Опис:</Form.Label>
                    <Form.Control
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Form.Label>Ціль:</Form.Label>
                    <Form.Control
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Form.Label>Мінімальна ставка:</Form.Label>
                    <Form.Control
                        type="number"
                        value={minBet}
                        onChange={(e) => setMinBet(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Form.Label>Крок ставки:</Form.Label>
                    <Form.Control
                        type="number"
                        value={betStep}
                        onChange={(e) => setBetStep(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Form.Label>Час перебиття попередньої ставки:</Form.Label>
                    <Form.Control
                        type="text"
                        value={timeToBeatBet}
                        onChange={(e) => setTimeToBeatBet(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex pt-4 justify-content-evenly align-content-center">
                    <Form.Label className="pt-2 pe-2">Початок:</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <Form.Control
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex pt-4 justify-content-evenly align-content-center">
                    <Form.Label className="pt-2 pe-2">Кінець:</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                    <Form.Control
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Form.Label>Зображення:</Form.Label>
                    <input
                        className="p-4"
                        type="file"
                        multiple
                        onChange={(e) => setImages(e.target.files === null
                            ? null : e.target.files[0])}
                    />
                </div>
                <Button onClick={handleFormSubmit}>Створити</Button>
            </Form>
        </div>
    );
};

export default LotCreationForm;