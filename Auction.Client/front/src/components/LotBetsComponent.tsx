import React, { useState, useEffect } from 'react';
import LotService from "../services/LotService";
import authUtils from "../services/authUtils";
import {Button, Card, Collapse, InputGroup, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ListGroup from "react-bootstrap/ListGroup";
import SignalRService from "./SignalRService";
import Bet from "../models/Bet";
import StartTimer from "./StartTimer";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import internal from "stream";


interface ILotBetCreation {
    userId: string;
    betAmount: number;
    lotId: number;
}

class LotBetCreation implements ILotBetCreation{
    constructor(userId: string,lotId: number, betAmount: number) {
        this.betAmount = betAmount;
        this.lotId = lotId;
        this.userId = userId
    }

    betAmount: number;
    lotId: number;
    userId: string;
}

export class LotBet{
    id : number
    amount: number;
    betTime: Date;
    username: string;

    constructor(id?:number,betAmount?: number, betDate?: Date, username?: string) {

        this.id = id ?? 0
        this.amount = betAmount ?? 0;
        this.betTime = betDate ?? new Date();
        this.username = username ?? "";
    }

}

interface LotBetProps{
    betStart: Date
    lotId: number
    isEnded: boolean
    updateRequired: boolean
    latestBetAmount: Function
}


const LotBetComponent: React.FC<LotBetProps> = (props) => {
    const [lotBets, setLotBets] = useState<LotBet[]>([]);
    const [newBetAmount, setNewBetAmount] = useState<number>(0);
    const [betAvailable, setBetAvailable] = useState<boolean>(true);
    const [currentLotEnd,setCurrentLotEnd] = useState<Date>(new Date(props.betStart));
    const [newBetAppeared, setNewBetAppeared] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currInterval,setCurrInterval] = useState<any>();
    //popup
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpText, setPopUpText] = useState("");
    const [popUpInterval, setPopUpInterval] = useState<any>('');
    useEffect(() => {
        let service = LotService.GetService();
        service.axios.get(service.apiPath+props.lotId+"/bets/",)
            .then(response => {
                setLotBets(response.data)
            })
            .catch(error => console.log(error));
    }, [props.lotId]);

    useEffect(() => {
        const signalRService = new SignalRService();
        signalRService.startConnection()
            .catch(() => console.log("error"))


        const init = setInterval(()=>{
            if (props.updateRequired)
                setBetAvailable(true);
        },props.betStart.getTime() - Date.now())

        signalRService.subscribeToNewBetReceived((newBet: any) => {
            console.log("Bet received.")
            clearInterval(currInterval);
            setCurrInterval(null)
            setCurrentLotEnd(new Date(Date.now() + 10000))
            setBetAvailable(true);
            setNewBetAppeared(true);
            setLotBets(prevBets => [newBet,...prevBets])
            props.latestBetAmount(newBet.betAmount)
        });

        // Clean up the SignalR connection when the component unmounts
        return () => {
            signalRService.stopConnection().then(r => this);
            clearInterval(init);
        };
    }, [currInterval, props.betStart]);

    const handleNewBetAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBetAmount(Number(event.target.value));
    };

    const handlePlaceBet = () => {
            let service = LotService.GetService();
            let bet = new LotBetCreation(authUtils.getUserId(),props.lotId,newBetAmount);
            // Make an API request to place a new bet
            service.axios.post('http://localhost:8080/api/bet',bet)
                .then(response => {
                    setPopUpText("Ставка успіщно виконана!")
                    setShowPopUp(true)
                    let timeout = setTimeout(() => {
                        console.log("closed");
                        setShowPopUp(false)
                        setPopUpInterval(timeout)
                        clearTimeout(popUpInterval)
                    },5000)
                    return () => clearTimeout(timeout)
                })
                .catch(error => console.log(error));
            // Check the response status


    };

    return (
        <Card className="h-100 min-h-72  shadow-lg">
            <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>{popUpText}</Modal.Body>
            </Modal>
            <h2 className="text-black display-6">Ставки</h2>
            { !props.isEnded ?
            /* Display the list of lot bets */
                <>
                    <div className="text-dark">
                        Час перебиття ставки<StartTimer startDate={currentLotEnd ?? new Date()}/>
                    </div>
                    <div className="d-flex flex-row">
                        <label className="text-black m-2 me-2" htmlFor="newBetAmount">Ставка: </label>
                        <input
                            className="w-25 rounded h-25 d-flex align-self-center shadow animation shadow-1-strong"
                            type="number"
                            id="newBetAmount"
                            min={lotBets.length !== 0 ? lotBets[0].amount : 0}
                            value={newBetAmount}
                            onChange={handleNewBetAmountChange}/>
                        <Button
                            className="h-6 m-2 mt-2 d-flex ms-0 flex-row align-self-center align-items-center ms-auto me-auto"
                            disabled={!betAvailable}
                            onClick={handlePlaceBet}>Поставити</Button>
                    </div></> : null
            }

            <ListGroup className="">
                {lotBets.length !== 0 ? lotBets.map((lotBet) => (
                    <Collapse className="bg" in={newBetAppeared || props.isEnded}>
                    <div className={"text-bg-secondary rounded-4 ease-in duration-300  bg-"+(lotBet.username === authUtils.getUser().email
                        ? "gradient-to-r gradient-deg-45 from-emerald-400 to-green-700"
                        : "gradient-to-r gradient-deg-45 from-red-200 to-red-600")
                        +" m-2 bg-opacity-75 w-75 align-self-center"} key={lotBet.username}>
                        <span className="font-semibold text-xl">{lotBet.amount} грн</span>
                        <h6>{lotBet.username === authUtils.getUser().email ? "Ваша ставка" : lotBet.username}</h6>
                    </div>
                    </Collapse>
                )) : <p className="h2 d-flex align-self-center mt-auto mb-auto">Ставки відсутні.</p>
            }
            </ListGroup>
        </Card>
    );
};

export default LotBetComponent;