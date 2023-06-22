import {Button, Card, FormText, Image} from "react-bootstrap";
import LotState from "../models/LotState";
import ListGroup from "react-bootstrap/ListGroup";
import moment from "moment/moment";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Lot} from "../models/Lot";
import LotService from "../services/LotService";
import StartTimer from "../components/StartTimer";

let axios = LotService.GetService().axios;

export const AdminLotsPage: React.FC = () => {
    const navigate = useNavigate();
    const [showState,setShowState] = useState<LotState>(LotState.Scheduled)
    const [loading, setLoading] = useState(false);
    const [lots, setLots] = useState<any[]>([]);
    const [lotsChanged, setLotsChanged] = useState<boolean>(false);


    useEffect(() => {
        axios.get('http://localhost:8080/api/lots/')
            .then(response => {
                response.data.forEach((lotDto: any) => {
                    lotDto.startDate = new Date(lotDto.startDate)
                    lotDto.endDate = new Date(lotDto.endDate)
                })
                setLots(response.data.filter((l:any) => Lot.getState(l) === LotState.Scheduled))
            })
            .catch(error => console.log(error))


    }, [lotsChanged]);
    
        const deleteClick = (event:any) => {
            axios.get('http://localhost:8080/api/lots/delete/' + event.target.id)
                .then(response => {
                    setLotsChanged(!lotsChanged);
                })
                .catch(error => console.log(error))

        }


    return(
            <div className="column w-100 p-5 rounded-3">
                <span className="text-5xl font-thin mb-4">Адміністрування</span>
                <div className="rounded-5 ms-auto me-auto mt-5 w-10 p-0 bg-emerald-400 h-auto" >
                <Button variant="" onClick={() => navigate("/create")} className="text-light rounded-5 m-0.5 h-10 d-flex">+</Button>
                </div>
                <ListGroup>

                    { lots.map((lot) => (
                            <>
                                <ListGroup.Item className="mt-2 rounded-3 hover:bg-slate-100 shadow-lg ease-in duration-300 mb-2">
                                    <div className="d-flex mt-2 ms-3 w-100 justify-content-between">
                                        <FormText>Початок: {moment(lot.startDate).format("D/MM/YY HH:mm")}</FormText>
                                        <Card className="  align-content-end">{showState === LotState.Scheduled ?
                                            <>До початку
                                                <StartTimer startDate={lot.startDate}/>
                                            </> :
                                            showState === LotState.Started ?
                                                <>До кінця
                                                    <StartTimer startDate={lot.endDate}/>
                                                </> : null
                                        }
                                        </Card>
                                    </div>
                                    <div className="d-flex align-items-start flex-row flex-nowrap justify-content-start">
                                        <div className="d-flex w-25 h-25 max-h-52 overflow-hidden">
                                            <Image
                                                className="card-img m-3 w-100 me-5 max-h-46 d-flex overflow-hidden border-2 shadow-blue-100 drop-shadow-xl shadow-inner  p-1 justify-self-center rounded-3"
                                                src={`data:image/jpeg;base64,${lot?.image}`} alt="">
                                            </Image>
                                        </div>
                                        <div className="d-flex mt-3 flex-column justify-content-start align-items-start">
                                            <span>Зареєстровано: {lot.participants ?? 0}</span>
                                            <span>Мінімальна ставка: {lot.minBet} грн.</span>
                                            <p>Опиc: {lot.description}</p>
                                            <div className="d-flex align-items-center">
                                                <span className="font-semibold">Спонсор:</span>
                                                <Image
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title={lot.organization.name}
                                                    className="card-img d-flex  border-2 shadow-blue-100 drop-shadow-xl shadow-inner align-self-center ms-auto me-auto p-1 justify-self-center rounded-3 h-12 w-auto"
                                                    src={`data:image/jpeg;base64,${lot?.organization.image}`} alt=""></Image>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-5 ms-auto me-auto  w-10 p-0 bg-red-400 h-auto" >
                                        <Button id={lot.id} onClick={deleteClick} variant=""  className="text-light font-semibold text-2xl rounded-6 m-1 h-10 d-flex">-</Button>
                                    </div>
                                    
                                </ListGroup.Item>
                            </>
                                
                                ))}
                </ListGroup>
            </div>);
};