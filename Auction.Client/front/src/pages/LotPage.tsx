import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import LotDetails from "../models/LotDetails";
import LotBetComponent from "../components/LotBetsComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Card, Carousel, Image, Modal} from "react-bootstrap";
import Item from "../models/Item";
import LotState from "../models/LotState";
import LotService from "../services/LotService";
import Bet from "../models/Bet";
import StartTimer from "../components/StartTimer";
import moment from "moment";
import SignalRService from "../components/SignalRService";
import {Lot} from "../models/Lot";


const itemInit = new Item("yest", "ne")
const lotInit = new LotDetails(itemInit, 1, "30", new Date(Date.now() + 5000), new Date(Date.now() + 1000000), "yes", 5000);


const LotPage: React.FC = () => {
    const {lotId} = useParams();
    const [lot, setLot] = useState<any>(undefined);
    const [loading, setLoading] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [bets, setBets] = useState<Bet>();
    const [winner, setWinner] = useState<any>();
    const [loaded, setLoaded] = useState(false);
    const [currBet, setCurrBet] = useState(0);

    //popup
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');

    useEffect(() => {
        let service = LotService.GetService();
        service.axios.get(service.apiPath + Number(lotId))
            .then(response => {
                let lotDto = response.data;
                lotDto.startDate = new Date(lotDto.startDate);
                lotDto.endDate = new Date(lotDto.endDate);
                setLot(lotDto);
                setLoaded(true);

                let showBets = setTimeout(() => {
                    console.log("I show bets....")
                    setLoading(!loading)
                }, (lotDto.startDate.getTime() ?? Date.now()) - Date.now())
                return () => clearTimeout(showBets);
            })
            .catch(error => console.log(error));


    }, [lotId, isEnded])

    useEffect(() => {
        const signalRService = new SignalRService();
        signalRService.startConnection()
            .catch(() => console.log(""))

        signalRService.subscribeToLotEndReceived(() => {
            console.log("Lot ended.")
            setIsEnded(true);
            setPopUpText("Аукціон завершено!")
            setShowPopUp(true)
            let timeout = setTimeout(() => {
                console.log("closed");
                setShowPopUp(false)
                setPopUpInterval(timeout)
                clearTimeout(popUpInterval)
            }, 5000)
            return () => clearTimeout(timeout)
        });

        if (Lot.getState(lot) === LotState.Ended && winner === undefined)
            getWinner(Number(lotId) ?? 0)

        return () => {
            signalRService.stopConnection().then(r => this);
        };
    })

    const onLotRegisterClick = (lotId: number) => {
        let service = LotService.GetService();
        service.axios.get(service.apiPath + "reg/" + lotId)
            .then(response => {
                let l = false;
                if (lot !== undefined)
                    lot.canUserBet = true
                setLoading(!loading)

                //register unavailable
            })
            .catch(error => window.alert(error));
    }

    const getWinner = (lotId: number) => {
        let service = LotService.GetService();
        service.axios.get(service.apiPath + lotId + "/winner")
            .then(response => {
                setWinner(response.data)
            })
            .catch(error => console.log(""));
    }


    if (loaded)
        return (
            <div className="bg-light min-vh-100 p-5 pt-0 flex-wrap d-flex align-items-baseline  w-100 h-100 d-flex">
                <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{popUpText}</Modal.Body>
                </Modal>
                <Carousel variant="dark"
                          className="d-flex align-items-baseline  w-50 max-h-72 overflow-auto h-75 pt-0 ms-auto me-auto align-self-center shadow-blue-200 shadow-2xl rounded-xl">
                    <Carousel.Item className="rounded-3  overflow-auto h-100 d-flex overflow-auto">
                        <Image
                            className="card-img  w-100 overflow-auto rounded-3 h-100"
                            src={`data:image/jpeg;base64,${lot?.item.image}`} alt=""></Image>
                    </Carousel.Item>
                </Carousel>

                <hr className="bg-primary w-75  shadow-1-primary d-flex ms-auto me-auto"></hr>

                <div className="d-flex align-content-center justify-content-center w-100 d-flex">
                    <Card
                        className="text-black shadow-lg ps-4 pb-4 pt-2 p-4 h-100 align-items-start justify-content-start d-flex flex-column w-50 me-5">
                        <>
                            <h2 className="display-6 align-self-center">Опис лоту</h2>
                            <div className="d-flex bg-red-5 bg-gray-50 flex-column w-75 m-auto hover:bg-slate-50 pt-1 pb-1 flex-row border
                         border-black rounded-3 p-4 text-xl m-2 ms-2 mt-1 mb-0 justify-content-center">
                                <div className="d-flex flex-column align-items-baseline">
                                    {
                                        Lot.getState(lot) === LotState.Scheduled ?

                                            <>
                                                <div className="d-flex  flex-row">
                                                    <span className="d-flex flex-nowrap align-self-baseline">Статус лоту:</span>
                                                    
                                        <span
                                            className="ms-1 align-self-baseline rounded-4 border-2 shadow-md shadow-amber-200/50 border-amber-500 p-1 border-opacity-10
                                         text-amber-400 drop-shadow-xl shadow-amber-500 d-flex text-xl font-thin">
                                            Реєстрація
                                        </span>
                                                </div>
                                                    
                                                    <div className="bg-amber-500 ms-auto me-auto rounded-4 bg-opacity-50 m-1">
                                                        {!lot?.canUserBet ? <Button
                                                            variant={""}
                                                                onClick={() => onLotRegisterClick(lot.id)}>Зареєструватися</Button>
                                                            : Lot.getState(lot) === LotState.Scheduled && lot.canUserBet ?
                                                                <Button disabled className="bg-dark">Ви вже
                                                                    зареєстровані
                                                                    ✔</Button>
                                                                : null}
                                                    </div>
                                            </>
                                            : Lot.getState(lot) === LotState.Started ?
                                                <>
                                                    <div className="d-flex  flex-row">
                                                        <span className="d-flex flex-nowrap align-self-baseline">Статус лоту:</span>
                                                        <span className="ms-1 align-self-baseline rounded-4 border-2 shadow-md shadow-emerald-200/50 border-emerald-500 p-1 border-opacity-10
                                         text-emerald-400 drop-shadow-xl shadow-amber-500 d-flex text-xl font-thin">Почався</span>
                                                    </div>
                                                    <span className="text-lg ">Поточна ставка: <span
                                                        className="ms-2 font-semibold">{currBet} грн.</span>
                                                </span>
                                                </>
                                                :
                                                <>
                                                    <div className="d-flex  flex-row">
                                                        <span className="d-flex align-self-baseline">Статус лоту:</span>
                                                        <span
                                                            className="ms-1 align-self-baseline rounded-4 border-2 shadow-md shadow-red-200/50 
                                                            border-red-500 p-1 border-opacity-10 text-red-500 text-opacity-80 
                                                            drop-shadow-xl shadow-amber-500 d-flex text-xl font-thin ">
                                                            Закінчився
                                                        </span>
                                                    </div>
                                                    <div className="d-flex flex-row">Переможець: {
                                                        winner === undefined ?
                                                            <div className="ms-1"> Відсутній</div> :
                                                            <div> {winner.email}</div>
                                                    }</div>
                                                </>

                                    }

                                </div>
                            </div>

                                <span
                                    className="text-xl m-2 mb-0 mt-2 ">Початкова ставка:<span className="font-semibold 
                                    text-transparent ms-2 bg-clip-text bg-gradient-to-r from-blue-500 to-violet-700">
                                    {lot?.minBet} грн.
                                </span>
                            </span>
                            <div className="d-flex flex-column w-50">
                                <span
                                    className="text-xl m-2 mt-2 mb-0 font-semibold justify-self-start align-self-start">Інформація</span>
                                <p className="border-2 shadow-md border-gray-100 m-2 mt-1 justify-content-start text-start w-100 pe-5 pb-5 pt-1 ps-1">{lot?.description}</p>
                            </div>
                            <span
                                className="text-xl m-2 mt-2 mb-0 ">Час початку: {moment(lot?.startDate).format("HH:mm DD/MM")}</span>
                            <span
                                className="text-xl m-2 mt-0 ">Час закінчення: {moment(lot?.endDate).format("HH:mm DD/MM")}</span>

                            <>
                                {!isEnded && Lot.getState(lot) === LotState.Started ?
                                    <><h4> До завершення:</h4><StartTimer startDate={lot?.endDate ?? new Date()}/></> :
                                    !isEnded && Lot.getState(lot) === LotState.Scheduled ?
                                        <><h4> До початку:</h4><StartTimer
                                            startDate={lot?.startDate ?? new Date()}/></> :
                                        null
                                }
                            </>
                        </>
                        <span></span>
                    </Card>

                    <div className="w-50 min-h-48 h-100 ">
                        {Lot.getState(lot) === LotState.Scheduled ?
                            null
                            :
                            Lot.getState(lot) === LotState.Started && !isEnded ?
                                <LotBetComponent latestBetAmount={setCurrBet} updateRequired={loading}
                                                 betStart={lot?.startDate}
                                                 isEnded={!lot.canUserBet} lotId={Number(lotId)}/>
                                : <LotBetComponent latestBetAmount={setCurrBet} updateRequired={loading}
                                                   betStart={lot?.startDate ?? new Date()}
                                                   isEnded={true}
                                                   lotId={Number(lotId)}/>

                        }
                    </div>
                </div>
            </div>
        )
    else
        return (<div></div>);
};

export default LotPage