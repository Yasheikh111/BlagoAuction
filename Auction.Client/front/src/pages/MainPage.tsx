import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import authUtils from "../services/authUtils";
import LotService from "../services/LotService";
import "../App.css"
import {Lot} from '../models/Lot';
import {LotList} from "../components/LotList";
import {Image} from "react-bootstrap";

let axios = LotService.GetService().axios;
const list = [new Lot(1, "yes", new Date(),new Date(),"20",false)]
const MainPage: React.FC<any> = (props: {setUser: any}) => {
        const [lots, setLots] = useState<any[]>([]);
    
    
        useEffect(() => {
            axios.get('http://localhost:8080/api/lots/')
                .then(response => {
                    response.data.forEach((lotDto: any) => {
                        lotDto.startDate = new Date(lotDto.startDate)
                        lotDto.endDate = new Date(lotDto.endDate)
                    })
                    setLots(response.data)
                })
                .catch(error => console.log(error))
    
        
        }, []);

    return (
        <div className="d-flex h-100 flex-column">
            <LotList isWinnerPage={false} isMainPage={true} lots={lots}></LotList>
        </div>
    );
};

export default MainPage;