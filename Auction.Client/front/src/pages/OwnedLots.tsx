import React, {useEffect, useState} from "react";
import authUtils from "../services/authUtils";
import {useNavigate} from "react-router-dom";
import LotState from "../models/LotState";
import ILot, {Lot} from "../models/Lot";
import LotService from "../services/LotService";
import LotDetails from "../models/LotDetails";
import {Button, ButtonGroup, Card, Dropdown, DropdownButton, FormText, Image} from "react-bootstrap";
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
                let lot: LotDetails = response.data;
                lots.find(l => l.id === lotId).isUserRegistered = true;
                setLoading(!loading)

                //register unavailable
            })
            .catch(error => window.alert(error));
    }


    return (
        <div className="d-flex w-100 flex-column ms-auto me-auto justify-content-center">
            <h1 className="d-flex align-self-center text-black-50 m-3">Ваші лоти</h1>
            {lots.length !== 0 ?
                <> 
                    
                    <div className="column  h-100 min-h-0.5 w-75 justify-content-center align-self-center p-3 rounded-3">
                        <ListGroup>
                            {lots.map((lot) => (
                                <>
                                    <ListGroup.Item
                                        className="mt-2 rounded-3 hover:bg-slate-100 shadow-lg ease-in duration-300 mb-2"
                                        onClick={() => navigate("/lot/" + lot.id)}>
                                        <div
                                            className="d-flex align-items-start flex-row flex-nowrap justify-content-start">
                                            <div className="d-flex w-25 h-25 max-h-52 overflow-hidden">
                                                <Image
                                                    className="card-im m-3 w-100 me-5 h-25 d-flex overflow-hidden border-2 shadow-blue-100 drop-shadow-xl shadow-inner  p-1 justify-self-center rounded-3"
                                                    src={`data:image/jpeg;base64,${lot?.image}`}
                                                    alt=""></Image>
                                            </div>
                                            <div
                                                className="d-flex  mt-3 text-muted flex-column justify-content-start align-self-center">
                                                <span>Дата закінченя: {moment(lot?.endDate).format("HH:mm DD/MM")}</span>
                                                <span
                                                    className="font-semibold">Переможна ставка: {lot.latestBet} грн.</span>
                                            </div>
                                            <span className="ms-auto text-lg text-red-400 align-self-center">
                                                Очікуйте звязку з адміністратором
                                            </span>
                                        </div>
                                    </ListGroup.Item>
                                </>
                            ))}
                        </ListGroup>
                    </div>
                </> : null}
                </div>
                );
            };

export default OwnedLots;