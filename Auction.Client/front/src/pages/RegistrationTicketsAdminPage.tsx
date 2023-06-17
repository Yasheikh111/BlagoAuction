import {Button, ButtonGroup, Card, Dropdown, DropdownButton, FormText, Image} from "react-bootstrap";
import LotState from "../models/LotState";
import ListGroup from "react-bootstrap/ListGroup";
import moment from "moment/moment";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ILot, {Lot} from "../models/Lot";
import authUtils from "../services/authUtils";
import LotService from "../services/LotService";
import LotDetails from "../models/LotDetails";

let axios = LotService.GetService().axios;

const list = [{
    id: 1,
    description: "yes",
    minBet: 20
}]

export const RegistrationTicketsAdminPage: React.FC = () => {
    const navigate = useNavigate();
    const [showState, setShowState] = useState<LotState>(LotState.Scheduled)
    const [loading, setLoading] = useState(false);

    const [tickets, setTickets] = useState<any[]>([]);


    useEffect(() => {
        axios.get('http://localhost:8080/api/Ticket')
            .then(response => {
                setTickets(response.data)
            })
            .catch(error => console.log(error))
    }, []);

    const handleAcceptClick = (event: any) => {
        axios.get('http://localhost:8080/api/Ticket/approve/' + event.target.id)
            .then(response => {
                console.log("Ticket Approved!")
            })
            .catch(error => console.log(error))
    }
    
    return (
        <div className="text-black d-flex flex-column ms-auto me-auto bg-light shadow rounded-3 w-75 align-self-start">
            <h1>Реєстраційні тікети</h1>
            <div className="column w-100 p-5 rounded-3">
                <ListGroup> 
                    {tickets.map((tk) => (
                        
                                <ListGroup.Item className="mt-2  mb-2">
                                    <div className="d-flex flex-column">
                                        <span className="align-self-end">Тікет #{tk.id}</span>
                                        <span>Пошта: {tk.email}</span>
                                        <span>Телефон: {tk.phone}</span>
                                        <span>Ініціали: {tk.firstname + " " + tk.surname}</span>
                                        <span>Організація: {tk.organization}</span>
                                    </div>
                                    <p className="pt-3">


                                    </p>
                                    <div className="d-flex justify-content-center align-content-center flex-row">
                                        <Button className="rounded-5 me-4 h-auto" id={tk.id} onClick={handleAcceptClick}>✓</Button>
                                        <Button className="rounded-5 hover:bg-red-700 border-0 h-auto bg-danger" id={tk.id} onClick={handleAcceptClick}>×</Button>
                                    </div>
                                </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>);
};