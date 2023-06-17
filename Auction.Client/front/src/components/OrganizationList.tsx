import {Button, ButtonGroup, Card, Dropdown, DropdownButton, FloatingLabel, FormText, Image} from "react-bootstrap";
import LotState from "../models/LotState";
import ListGroup from "react-bootstrap/ListGroup";
import moment from "moment/moment";
import StartTimer from "./StartTimer";
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

export const OrganizationList: React.FC<{ organizations: any[],isAdminPanel: boolean }> = (props: { organizations: any[],isAdminPanel:boolean }) => {
    const navigate = useNavigate();
    const [showState, setShowState] = useState<LotState | undefined>(undefined)
    const [loading, setLoading] = useState(false);

    const deleteClick = (event:any) => {
        axios.get('http://localhost:8080/api/Organization/delete/' + event.target.id)
            .then(response => {
                props.organizations = props.organizations.filter((l: any) => l.id !== event.target.id)
            })
            .catch(error => console.log(error))

    }
    
    return (
        <><h1 className="d-flex align-self-center text-black-50 m-3">Організації</h1>
            <div className="column h-100 min-h-0.5 w-75 justify-content-center align-self-center p-3 rounded-3">
                {props.isAdminPanel ? <div className="rounded-5 ms-auto me-auto w-10 p-0 bg-emerald-400 h-auto" >
                    <Button variant="" onClick={() => navigate("/createOrg")} className="text-light rounded-5 m-0.5 h-10 d-flex">+</Button>
                    </div> : null}
                <ListGroup>
                    {props.organizations.map((organization) => (
                            <>
                                <ListGroup.Item
                                    className="mt-2 rounded-3 hover:bg-slate-100 shadow-lg ease-in duration-300 mb-2"
                                    onClick={() => navigate("/organization/" + organization.id)}>
                                    <div
                                        className="d-flex align-items-start flex-row flex-nowrap justify-content-start">
                                        <span className="align-self-center">{organization.name}</span>
                                        <div className="d-flex w-50 ms-auto h-25 max-h-52 overflow-hidden">
                                            <Image
                                                className="card-im m-3 w-25 me-5 h-25 d-flex overflow-hidden border-2 shadow-blue-100 drop-shadow-xl shadow-inner  p-1 justify-self-center rounded-3"
                                                src={`data:image/jpeg;base64,${organization?.image}`} alt=""></Image>
                                        </div>
                                        <div
                                            className="d-flex mt-3 flex-column justify-content-start align-items-start">
                                            <span>Успішних лотів: {organization.completedLots ?? 0}</span>
                                            <span className="font-semibold">Зібрано всьго: {organization.amountReceived} грн.</span>
                                        </div>
                                    </div>
                                </ListGroup.Item>

                            </>

                    ))}
                </ListGroup>
                
            </div>
        </>);
};