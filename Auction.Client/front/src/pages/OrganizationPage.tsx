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


const lotsInit: Array<Lot> = [new Lot(1,"desc",new Date(Date.now()),new Date(Date.now() + 1000000), "30"),
    new Lot(2,"desc1",new Date(Date.now() + 10000000),new Date(Date.now() + 2000000000), "25")]


const OrganizationPage: React.FC<any> = (props) => {

    const {orgId} = useParams();
    const [lots, setLots] = useState<any[]>(lotsInit);
    const [user, setUser] = useState<any>(authUtils.emptyUser);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showState,setShowState] = useState<LotState>(LotState.Scheduled)
    const [org,setOrg] = useState<any>("");

    useEffect(() => {
        axios.get('http://localhost:8080/api/organization/'+orgId)
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
            <div className="d-flex flex-column">
                {org !== "" ?
                    <><h1>{org.name}</h1><Image
                        data-toggle="tooltip"
                        data-placement="top"
                        title={org.name}
                        className="card-img d-flex  border-2 shadow-blue-100 drop-shadow-xl shadow-inner align-self-center ms-auto me-auto p-1 justify-self-center rounded-3 h-12 w-auto"
                        src={`data:image/jpeg;base64,${org.image}`} alt=""></Image>
                        <h4>Зароблено: {org.amountReceived}</h4><h5>Успішних лотів:{org.completedLots}</h5>
                        <div className="d-flex justify-content-center">
                            <LotList isMainPage={false} lots={org.lots}></LotList>
                        </div>
                    
             </> : null}
            </div>
    );
};

export default OrganizationPage;