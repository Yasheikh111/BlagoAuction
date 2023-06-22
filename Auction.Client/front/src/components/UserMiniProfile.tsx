import React, {FC, useEffect, useState} from "react";
import authUtils from "../services/authUtils";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import LotService from "../services/LotService";
import {Role} from "../models/User";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownItem from "react-bootstrap/DropdownItem";
import "bootstrap/dist/css/bootstrap.min.css";
import {AuthProps} from "./auth/SignInForm";



export const UserMiniProfile: React.FC<AuthProps> = (props : AuthProps) => {
    const nav = useNavigate();
    const [user, setUser] = useState<any>("");
    const [intervalId, setIntervalId] = useState("");
    const [fetched, setFetched] = useState(false);

    const fetchUser = () => {
        let service = LotService.GetService();
        service.axios.get("http://localhost:8080/api/user/validate").then(res => {
            const str: keyof typeof Role = res.data.role;
            res.data.role = Role[str];
            console.log(res.data)
            setUser(res.data)
            let user =  JSON.parse(sessionStorage["user"]);
            let s = {...user,role: res.data.role}
            sessionStorage["user"] = JSON.stringify(s)
        })
            .catch(err => {
                console.log(err)
                if (sessionStorage.getItem("user") === undefined)
                    return
                sessionStorage.removeItem("user")
                props.setIsAuthenticated(false);
                console.log("bb")})
    }
    
    useEffect(() => {
        fetchUser()
        setTimeout(() => {
            fetchUser();
            setFetched(!fetched);
        }, 3000)
    },[fetched])

    const onClick= () => {
        props.setIsAuthenticated(false);
        sessionStorage.removeItem("user")
        nav("/login")
    }

    const onPayClick= () => {
        nav("/pay")
    }
    
    return(
        <div className="d-flex flex-row align-self-lg-end justify-self-end justify-content-evenly ms-auto me-44">
            <div className="d-flex flex-row font-semibold text-light text-sm rounded-5">
                <div className="d-flex">
                    <div className="bg-slate-500 d-flex flex-row rounded-s-lg p-1 ps-2 pe-2 skew-x-12 m-1 me-0  align-self-center ">
                        <span className="-skew-x-12">{user.email}</span>
                    </div>
                <Dropdown className="d-flex rounded-e-md rounded-4" as={ButtonGroup}>
                    <Dropdown.Toggle variant="secondary" className="d-flex flex-wrap justify-content-center align-content-center pt-auto pb-auto rounded-end rounded-0  m-1 ms-0 skew-x-12 " split id="dropdown-split-basic" />
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => nav("/owned/")}>Мої лоти</Dropdown.Item>
                        <Dropdown.Item onClick={onClick}>Вийти</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </div>
                <div className="d-flex">
                    <div className="bg-emerald-600 d-flex p-1 ps-2 pe-2 skew-x-12 align-self-center ">
                        <span className="-skew-x-12">Рахунок: {user.balance} ₴</span>
                    </div>
                    <Dropdown className="d-flex rounded-e-md rounded-4" as={ButtonGroup}>
                        <Dropdown.Toggle variant="secondary" className="d-flex flex-wrap justify-content-center align-content-center pt-auto pb-auto rounded-end rounded-0  m-1 ms-0 skew-x-12 " split id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={onPayClick}>Поповнити</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {user.role !== "User" ? 
                <div className="d-flex">
                    <div className="bg-sky-600  skew-x-12 m-1 ms-0 me-0 align-self-center p-1">
                        <span className="d-flex -skew-x-12">{user.role}</span></div>
                    <Dropdown className="d-flex rounded-e-md rounded-4" as={ButtonGroup}>
                        <Dropdown.Toggle variant="secondary" className="d-flex text-xs flex-wrap justify-content-center align-content-center pt-auto pb-auto rounded-end rounded-0  m-1 ms-0 skew-x-12 " split id="dropdown-split-basic" />
                        
                            {user.role === "Admin" ?
                                <Dropdown.Menu >
                                    <DropdownItem onClick={() => nav("create")}>Додати аукціон</DropdownItem>
                                    <DropdownItem   onClick={() => nav("manageOrgs")}>Додати організацію</DropdownItem>
                                    <DropdownItem   onClick={() => nav("lots")}>Адміністрування аукціонів</DropdownItem>
                                    <DropdownItem   onClick={() => nav("ticket")}>Реєстраційні тікети</DropdownItem>
                                </Dropdown.Menu> :
                                <Dropdown.Menu>
                                    <DropdownItem onClick={() => nav("create")}>Додати аукціон</DropdownItem>
                                </Dropdown.Menu>
                            }
                    </Dropdown>
                
                </div> : null}
            </div>
        </div>
    );
}