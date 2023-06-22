import {Button, ButtonGroup, Card, Dropdown, DropdownButton, FormText, Image} from "react-bootstrap";
import LotState from "../models/LotState";
import ListGroup from "react-bootstrap/ListGroup";
import moment from "moment/moment";
import StartTimer from "./StartTimer";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Lot} from "../models/Lot";
import LotService from "../services/LotService";
import LotDetails from "../models/LotDetails";
import "../index.css"

let axios = LotService.GetService().axios;

const list = [{
    id: 1,
    description: "yes",
    minBet: 20
}]

export const LotList: React.FC<{ lots: any[],isMainPage:boolean, isWinnerPage:boolean }> = (props: { lots: any[],isMainPage:boolean,isWinnerPage:boolean }) => {
    const navigate = useNavigate();
    const [showState, setShowState] = useState<LotState | undefined>(
        !props.isWinnerPage ? LotState.Scheduled : LotState.Ended)
    const [loading, setLoading] = useState(false);


    const StateToColor = new Map<LotState, string>();
    StateToColor.set(LotState.Scheduled, "В очікуванні")
    StateToColor.set(LotState.Started, "В процесі")
    StateToColor.set(LotState.Ended, "Закінчені")

    
    
    const onLotRegisterClick = (lotId: number) => {
        let service = LotService.GetService();
        service.axios.get(service.apiPath + "reg/" + lotId)
            .then(response => {
                let lot: LotDetails = response.data;
                let l = props.lots.find(l => l.id === lotId) ?? new Lot();
                l.isUserRegistered = true;
                setLoading(!loading)
                
                //register unavailable
            })
            .catch(error => window.alert(error));
    }


    return (
        <div style={{minHeight: "200px"}} className="d-flex w-100 h-100 flex-column">
            <div className="w-2/4 d-flex align-self-center m-5">
        {props.isMainPage ? <Image
            className="card-img ease-in duration-100   rounded-4
             shadow-2xl hover:scale-105 animation h-100"
            src={require("../logos/logo.jpg")}></Image> : null
        }
            </div>
            <div className="h-100 h-100 mb-5 min-h-fit overflow-auto w-75 justify-content-center align-self-center  rounded-3">
                {!props.isWinnerPage ?
                <div id="scr" className="d-flex bg-slate-300 p-1 mt-0 sticky-top rounded-3 flex-row">
                    <span className="font-semibold align-self-center">Статус:</span>
                    <ButtonGroup className="bg-sky-300">
                        <DropdownButton variant="" as={ButtonGroup}
                                        title={showState === undefined ? "Статус лоту" : StateToColor.get(showState)}
                                        id="bg-nested-dropdown">
                            <Dropdown.Item eventKey="1" onClick={() => setShowState(LotState.Scheduled)}>В
                                очікуванні</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={() => setShowState(LotState.Started)}>В
                                процесі</Dropdown.Item>
                            <Dropdown.Item eventKey="3"
                                           onClick={() => setShowState(LotState.Ended)}>Закінчені</Dropdown.Item>
                        </DropdownButton>
                    </ButtonGroup>
                </div> : null
                }
                <ListGroup>

                    {props.lots.filter(l => Lot.getState(l) === showState).length !== 0 ? props.lots.map((lot) => (
                        showState === Lot.getState(lot) ?
                            <>
                                <ListGroup.Item
                                    className="mt-2 rounded-3 hover:bg-slate-100 shadow-md ease-in duration-300 mb-2"
                                    >
                                    <div className="d-flex mt-2 ms-3 w-100 justify-content-between">
                                        <FormText>Початок: {moment(lot.startDate).format("D/MM/YY HH:mm")}</FormText>
                                        <Card className="me-4 align-content-end">{showState === LotState.Scheduled ?
                                            <>До початку
                                                <StartTimer startDate={lot.startDate}/>
                                            </> :
                                            showState === LotState.Started ?
                                                <>До кінця
                                                    <StartTimer startDate={lot.endDate}/>
                                                </> : null}
                                        </Card>
                                    </div>
                                    <div
                                        className="d-flex align-items-start flex-row flex-nowrap justify-content-start">
                                        <div className="d-flex w-25 aspect-square h-25 max-h-52 overflow-hidden">
                                            <Image
                                                className="card-img m-3 aspect-square me-5 max-h-46 d-flex overflow-hidden border-2 shadow-blue-100 drop-shadow-xl shadow-inner  p-1 justify-self-center rounded-3"
                                                src={`data:image/jpeg;base64,${lot?.image}`} alt=""></Image>
                                        </div>
                                        <div
                                            className="d-flex mt-3 text-muted text-lg flex-column justify-content-start align-items-start">
                                            <span>Збираємо на: {lot.goal ?? 0}</span>
                                            <span>Вже зареєстровано: {lot.participants ?? 0}</span>
                                            <span>Мінімальна ставка: {lot.minBet} грн.</span>
                                            <p>Опиc: {lot.description}</p>
                                            <div className="d-flex align-items-center">
                                                <span className="font-semibold">Спонсор:</span>
                                                <Image
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title={lot.organization.name}
                                                    className="card-img d-flex  border-2 shadow-blue-100 drop-shadow-xl shadow-inner align-self-center ms-auto me-auto p-1 justify-self-center rounded-3 h-12 w-auto"
                                                    src={`data:image/jpeg;base64,${lot?.organization.image}`}
                                                    alt=""></Image>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="rounded-4 ms-auto bg-red-400"> 
                                        <Button onClick={() => navigate("/lot/" + lot.id)} variant="" className="text-light font-white">Переглянути</Button>
                                        </div>
                                        <div className="rounded-4 ms-2 me-auto bg-blue-400">
                                    {Lot.getState(lot) === LotState.Scheduled && !lot.isUserRegistered ? 
                                        
                                        <Button variant="" className="text-light rounded-4 font-white" onClick={() => onLotRegisterClick(lot.id)}>Зареєструватися</Button>
                                        : Lot.getState(lot) === LotState.Scheduled && lot.isUserRegistered ?
                                            <Button disabled className="bg-dark rounded-4">Ви вже зареєстровані ✔</Button> : null}
                                    </div>
                                    </div>
                                </ListGroup.Item>

                            </>
                            : null

                    )) : <h2>Аукціонів в цій категорії не знайдено</h2>}
                </ListGroup>
            </div>
        </div>);
};