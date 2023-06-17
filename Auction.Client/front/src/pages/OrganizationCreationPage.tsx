import React, { useState } from 'react';
import {Button, Form, Image, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LotService from "../services/LotService";
import lotService from "../services/LotService";
import moment from "moment";
import {convertFileToBase64} from "../services/ImageUtils";
const OrganizationCreationPage = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');


    const [name, setName] = useState("");

    const [image, setImages] = useState<any>();


    const handleFormSubmit = ()  => {

        let s = LotService.GetService();
        convertFileToBase64(image).then(res => {
            let im = res as String;
            console.log(im);
            s.axios.post("http://localhost:8080/api/organization/",{
                name: name,
                image: im.split(",",2)[1]
            }).then(res => {
                setPopUpText("Організацію додано!")
                setShowPopUp(true)
                let timeout = setTimeout(() => {
                     console.log("closed");
                     setShowPopUp(false)
                     setPopUpInterval(timeout)
                     clearTimeout(popUpInterval)
                },5000)
                return () => clearTimeout(timeout)
            }).catch(e => {
                console.log(e)
                setPopUpText(e.response.data)
                setShowPopUp(true)
                let timeout = setTimeout(() => {
                    console.log("closed");
                    setShowPopUp(false)
                    setPopUpInterval(timeout)
                    clearTimeout(popUpInterval)
                    return () => clearTimeout(timeout)
                },5000)
                return () => clearTimeout(timeout)
                
            })
            // setDescription('');
            // setTarget('');
            // setMinBet('');
            // setBetStep('');
            // setStartDate('');
            // setEndDate('');
                // setImages('');
        })
    }


    return (
        <div className="align-content-center m-auto p-4 bg-white rounded-4 w-50 justify-content-center">
            <h2>Додавання організації</h2>
            <Form className="column flex-wrap d-flex flex-column " onSubmit={handleFormSubmit}>
                <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{popUpText}</Modal.Body>
                </Modal>
                <div>
                    <Form.Label>Назва:</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Form.Label>Зображення:</Form.Label>
                    <input
                        className="p-3"
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

export default OrganizationCreationPage;