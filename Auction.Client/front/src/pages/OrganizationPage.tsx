import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import authUtils from "../services/authUtils";
import LotService from "../services/LotService";
import {useNavigate, useParams} from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import "../App.css"
import LotState from "../models/LotState";
import ILot, {Lot} from '../models/Lot';
import {Button, ButtonGroup, Card, Dropdown, DropdownButton, FormText, Image} from "react-bootstrap";
import moment from "moment";
import LotDetails from "../models/LotDetails";
import StartTimer from "../components/StartTimer";
import {LotList} from "../components/LotList";


let axios = LotService.GetService().axios;


const lotsInit: Array<Lot> = [new Lot(1, "desc", new Date(Date.now()), new Date(Date.now() + 1000000), "30"),
    new Lot(2, "desc1", new Date(Date.now() + 10000000), new Date(Date.now() + 2000000000), "25")]


const OrganizationPage: React.FC<any> = (props) => {

    const {orgId} = useParams();
    const [lots, setLots] = useState<any[]>(lotsInit);
    const [user, setUser] = useState<any>(authUtils.emptyUser);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showState, setShowState] = useState<LotState>(LotState.Scheduled)
    const [org, setOrg] = useState<any>("");

    useEffect(() => {
        axios.get('http://localhost:8080/api/organization/' + orgId)
            .then(response => {
                response.data.lots.forEach((lotDto: any) => {
                    lotDto.startDate = new Date(lotDto.startDate)
                    lotDto.endDate = new Date(lotDto.endDate)
                })
                setOrg(response.data)
                console.log(response.data.lots)
                props.setUser(authUtils.getUser())
                setLoading(!loading);
            })
            .catch(error => console.log(error))


    }, []);

    return (
        <div className="d-flex h-100 flex-column overflow-clip w-100">
            <div className="d-flex p-5 min-h-fit flex-row">
                
                <div className=" w-25 h-auto text-md justify-content-start align-items-center">
                <Image
                    data-toggle="tooltip"
                    data-placement="top"
                    title={org.name}
                    className="card-img d-flex border-2 shadow-blue-100 drop-shadow-xl shadow-inner me-auto p-1 rounded-3 w-100"
                    src={`data:image/jpeg;base64,${org.image}`} alt="">
                </Image>
                    <span className="me-auto">{org.name}</span>
                </div>
                <span className="ms-auto text-slate-500 text-xl me-auto">Всього зібрано:
                   <span className="font-black">{org.amountReceived} грн. </span> 
                </span>
                <span className="ms-auto text-slate-500 text-xl me-auto">Успішних лотів: 
                    <span className="font-black">{org.completedLots}</span> </span>
            </div>
            <div className="d-flex w-100 h-100 max-h-fit justify-content-center">
                <LotList isMainPage={false} isWinnerPage={false} lots={org?.lots ?? []}></LotList>
            </div>
        </div>
    );
};

export default OrganizationPage;