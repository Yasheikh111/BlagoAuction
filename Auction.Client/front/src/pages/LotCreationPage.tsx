import React, {useEffect, useState} from 'react';
import {Button, FloatingLabel, Form, Image, InputGroup, Modal} from "react-bootstrap";
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
    const [target, setTarget] = useState('XXXX XXXX XXXX XXXX');
    const [minBet, setMinBet] = useState('');
    const [betStep, setBetStep] = useState('');
    const [goal, setGoal] = useState("");

    const [startDate, setStartDate] = useState<any>();
    const [startTime, setStartTime] = useState<any>();
    const [timeToBeatBet, setTimeToBeatBet] = useState<any>();

    const nav = useNavigate();

    const [endDate, setEndDate] = useState<any>();
    const [organizationId, setOrganizationId] = useState<Number>(0);

    const [endTime, setEndTime] = useState<any>();

    const [image, setImages] = useState<any>();

    const handleFormSubmit = () => {

        let s = LotService.GetService();

        convertFileToBase64(image)
            .then((image64) => {
                let im = image64 as string;
                let momentStart = moment(startDate + startTime, 'YYYY-MM-DDLT');
                let momentEnd = moment(endDate + endTime, 'YYYY-MM-DDLT');


                s.axios.post(s.apiPath + "add/", {
                    description: description,
                    goal: goal,
                    targetCard:target,
                    minBet: minBet,
                    betStep: betStep,
                    image: im.split(",", 2)[1],
                    startTime: momentStart.valueOf() + 1000 * 60 * 60 * 3,
                    endTime: momentEnd.valueOf() + 1000 * 60 * 60 * 3,
                    organizationId: organizationId,
                    secondsToBeatPrevBet: timeToBeatBet
                }).then(res => {
                    setPopUpText("Лот додано!")
                    setShowPopUp(true)
                    let timeout = setTimeout(() => {
                        console.log("closed");
                        setShowPopUp(false)
                        setPopUpInterval(timeout)
                        clearTimeout(popUpInterval)
                        nav("/lots")
                    }, 2000)
                }).catch(e => {
                    setPopUpText(e)
                    setShowPopUp(true)
                    let timeout = setTimeout(() => {
                        console.log("closed");
                        setShowPopUp(false)
                        setPopUpInterval(timeout)
                        clearTimeout(popUpInterval)
                    }, 500)
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
        if (!User.validatedRole(authUtils.getUser(), "Admin") &&
            !User.validatedRole(authUtils.getUser(), "Moderator")) {
            nav("/")
        }
    })


    return (
        <div
            className="align-content-center overflow-auto m-4 ms-auto me-auto p-4 bg-white rounded-4 w-50 justify-content-center">
            <h2 className="display-6 mb-5 align-self-center">Створення аукціону</h2>
            <Form className="column d-flex align-content-center justify-content-center flex-column "
                  onSubmit={handleFormSubmit}>
                <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{popUpText}</Modal.Body>
                </Modal>
                {!User.validatedRole(authUtils.getUser(), "Moderator") ?
                    <SearchComponent setSelectedOrganization={setOrganizationId}/> : null
                }
                <div className="w-75 m-2 ms-auto me-auto">
                    <FloatingLabel controlId="floatingTextarea2" label="Опис">
                        <Form.Control
                            as="textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder={"ds"}
                        />
                    </FloatingLabel>
                </div>
                <div>
                    <div className="m-2 ms-auto me-auto w-75">
                        <InputGroup>
                            <FloatingLabel
                                controlId="floatingInput"
                                placeholder="xxxx xxxx xxxx xxxx"
                                label="Реквізити збору"
                            >
                                <Form.Control
                                    type="tel"
                                    inputMode={"numeric"}
                                    autoComplete="cc-number"
                                    pattern="[0-9\s]{13,19}"
                                    maxLength={19}
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    required
                                />
                            </FloatingLabel>
                        </InputGroup>
                    </div>
                </div>
                <div>
                    <div className="m-2 ms-auto me-auto w-75">
                        <InputGroup>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Ціль збору"
                            >
                                <Form.Control
                                    type="text"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    required
                                />
                            </FloatingLabel>
                        </InputGroup>

                    </div>
                </div>
                <div className="m-2 ms-auto me-auto w-75">
                    <InputGroup>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Мінімальна ставка"
                        >
                            <Form.Control
                                type="number"
                                value={minBet}
                                onChange={(e) => setMinBet(e.target.value)}
                                required
                                min={100}
                                placeholder={"100"}
                            />
                        </FloatingLabel>
                        <InputGroup.Text>грн</InputGroup.Text>
                    </InputGroup>

                </div>
                <div className="w-75 m-2 ms-auto me-auto">
                    <InputGroup>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Крок ставки"
                        >
                            <Form.Control
                                type="number"
                                value={betStep}
                                onChange={(e) => setBetStep(e.target.value)}
                                required
                                min={1}
                                max={50}
                                placeholder={"100"}
                            />
                        </FloatingLabel>
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>

                </div>
                <div className="w-75 m-2 ms-auto me-auto">

                    <InputGroup>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Кількість часу на перебиття ставки"
                        >
                            <Form.Control
                                placeholder={"dsds"}
                                type="number"
                                value={timeToBeatBet}
                                onChange={(e) => setTimeToBeatBet(e.target.value)}
                                required
                                min={10}
                                max={100000}

                            />
                        </FloatingLabel>
                        <InputGroup.Text>сек.</InputGroup.Text>
                    </InputGroup>
                </div>
                <div className="d-flex flex-col w-75 m-2 ms-auto me-auto ">
                    <Form.Label className="pt-2 pe-2">Дата початку</Form.Label>
                    <div className="">
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
                </div>
                <div className="d-flex flex-col w-75 m-2 ms-auto me-auto ">
                    <Form.Label className="pt-2 pe-2">Дата закінчення</Form.Label>
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
                <div className="d-flex flex-col w-75 m-2 ms-auto me-auto ">
                    <Form.Label>Зображення</Form.Label>
                    <input
                        className="form-control"
                        type="file"
                        multiple
                        onChange={(e) => setImages(e.target.files === null
                            ? null : e.target.files[0])}
                    />
                </div>
                <Button className="w-50 mx-auto my-4" onClick={handleFormSubmit}>Створити</Button>
            </Form>
        </div>
    );
};

export default LotCreationForm;