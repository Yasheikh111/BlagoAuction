import React, {useEffect, useState} from "react";
import authUtils from "../services/authUtils";
import {useNavigate} from "react-router-dom";
import LotState from "../models/LotState";
import ILot, {Lot} from "../models/Lot";
import LotService from "../services/LotService";
import LotDetails from "../models/LotDetails";
import {Button, ButtonGroup, Card, Dropdown, DropdownButton, FormText} from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import moment from "moment/moment";
import StartTimer from "../components/StartTimer";
import axios from "axios";
import {LotList} from "../components/LotList";

const OwnedLots: React.FC = () => {
    const [lots, setLots] = useState<any[]>([]);
    const [user, setUser] = useState<any>(authUtils.emptyUser);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/user/lots/')
            .then(response => {
                response.data.forEach((lotDto: any) => {
                    lotDto.startDate = new Date(lotDto.startDate);
                    lotDto.endDate = new Date(lotDto.endDate);
                })
                setLots(response.data)
            })
            .catch(error => console.log(error))


    }, []);
    
    
    const onLotRegisterClick = (lotId: number) => {
        let service = LotService.GetService();
        service.axios.get(service.apiPath + "reg/" + lotId)
            .then(response => {
                let lot:LotDetails = response.data;
                lots.find(l => l.id === lotId).isUserRegistered=true;
                setLoading(!loading)

                //register unavailable
            })
            .catch(error => window.alert(error));
    }


    return (
            <div className="d-flex flex-column ms-auto me-auto justify-content-center">
                <h1>Користувацькі лоти.</h1>
                {lots.length !== 0 ? 
                <LotList lots={lots} isMainPage={false} isWinnerPage={true}></LotList>
                    : <div className="h2">Нажаль нічого :(...</div>
                }
            </div>
    );
};

export default OwnedLots;