import React, {Component, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import "react-bootstrap";
import axios from "axios";
import authUtils from "../services/authUtils";
import {Button, Card} from "react-bootstrap";


class UserCreds {
    constructor(email: string, password: string) {
        this.Email = email;
        this.Password = password;
    }

    private Email: string;
    private Password : string;
}

interface AuthProps{
    component: React.ComponentType<any> | null
    setIsAuthenticated:any
}

const AuthPage: React.FC<AuthProps> = ({component: Component,setIsAuthenticated:any}) => {
    const navigate = useNavigate();


    return (
                <Card className="w-50 m-auto p-5 pt-1 shadow-xl shadow-inner-xl  justify-content-center align-content-center">
                    {Component == null ? (
                        <div className="d-flex justify-content-center container-fluid flex-column"><span
                            className="text-center justify-content-center mb-5 font-thin text-5xl text-dark">Авторизація</span>
                            <Button className="p-2 align-self-center w-75 m-2" onClick={() => navigate("/signin")}>Вхід</Button>
                            <Button className="p-2 align-self-center w-75 m-2" onClick={() => navigate("/signup")}>Реєстрація</Button>
                        </div>
                        ) : (
                            <>
                                <Component setIsAuthenticated={any}/>
                            </>)
                    }
                </Card>
    );
};

export default AuthPage;