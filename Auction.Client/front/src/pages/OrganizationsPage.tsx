import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import authUtils from "../services/authUtils";
import LotService from "../services/LotService";
import "../App.css"
import {Lot} from '../models/Lot';
import {LotList} from "../components/LotList";
import {Image} from "react-bootstrap";
import {OrganizationList} from "../components/OrganizationList";

let axios = LotService.GetService().axios;
const list = [new Lot(1, "yes", new Date(),new Date(),"20",false)]
const OrganizationsPage: React.FC<any> = (props: {setUser: any}) => {
    const [organizations, setOrganizations] = useState<any[]>([]);


    useEffect(() => {
        axios.get('http://localhost:8080/api/Organization/')
            .then(response => {
                setOrganizations(response.data)
            })
            .catch(error => console.log(error))


    }, []);

    return (
        <>
            <OrganizationList organizations={organizations} isAdminPanel={false}></OrganizationList>
        </>
    );
};

export default OrganizationsPage;