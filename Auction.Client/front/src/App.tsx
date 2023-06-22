import React, {useState} from 'react';
import './App.css'
import AuthPage from "./pages/AuthPage";
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import ProtectedRoute from "./components/ProtectedRoute";
import MainPage from "./pages/MainPage";
import authUtils from "./services/authUtils";
import LotPage from "./pages/LotPage";
import {Container, Image, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {UserMiniProfile} from "./components/UserMiniProfile";
import OwnedLots from "./pages/OwnedLots";
import LotCreationPage from "./pages/LotCreationPage";
import classes from "*.module.css";
import PaymentPage from "./pages/PaymentPage";
import OrganizationCreationPage from "./pages/OrganizationCreationPage";
import OrganizationPage from "./pages/OrganizationPage";
import TicketPage from "./pages/TicketPage";
import {RegistrationTicketsAdminPage} from "./pages/RegistrationTicketsAdminPage";
import {AdminLotsPage} from "./pages/AdminLotsPage";
import {MDBFooter} from "mdb-react-ui-kit";
import ReactLogo from './logos/chat-svgrepo-com.svg';
import OrganizationsPage from "./pages/OrganizationsPage";
import AdminOrganizationsPage from "./pages/AdminOrganizationPage";
import {UserSeatsComponent} from "./pages/UserSeatsComponent";

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const navigate = useNavigate();
    const onLogoSelect = () => {
        setIsHidden(false)
        return () => setIsHidden(true)
    }

    return (
        <div className="App navbar-scroll overflow-y-auto overflow-auto h-100">
            <>
                <header className="sticky-top fixed-top align-top">
                    <Navbar variant="light"
                            className="w-100 pe-5 bg-white flex-row p-3 m-0 border-b-2 shadow-b-lg border-bottom-1 d-flex rounded-2">
                        <Navbar.Brand className="ms-3 d-flex bg-sky-50 align-items-baseline shadow-md rounded-5 px-3"
                                      href="/">
                            <span className="font-semibold text-gray-600 me-1 text-2xl">Blago </span>
                            <div className=" align-items-center font-extrabold  hover:bg-red-400 rounded-5">
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">🇺</span>
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">🇦</span>
                            </div>
                        </Navbar.Brand>
                        {authUtils.isUserAuthenticated()
                            ? <>
                                <Navbar.Toggle onClick={() => navigate("/organizations/")}
                                               className="text-xl hover:bg-slate-50 ms-44 text-dark border-0 d-flex">
                                    <span className="text-sm">Організації</span></Navbar.Toggle>
                                <Navbar.Toggle onClick={() => navigate("/")}
                                               className="text-xl hover:bg-slate-50 text-dark border-0 d-flex">
                                    <span className="text-sm">Лоти</span></Navbar.Toggle>
                                <UserMiniProfile setIsAuthenticated={setIsAuth}></UserMiniProfile>
                            </>
                            : null
                        }
                    </Navbar>
                </header>

                <main className="min-h-screen h-100">
                    <div className="w-100 flex-column p-0 container h-100">

                        <div className="d-flex text-dark h-100 flex-column bg-light text-black border-1 
                shadow-md w-100 align-content-center">

                            <Routes>
                                <Route path="/createOrg" element={<OrganizationCreationPage/>}/>
                                <Route path="/create" element={<LotCreationPage/>}/>
                                <Route path="/lots" element={<AdminLotsPage/>}/>
                                <Route path="/login"
                                       element={<AuthPage setIsAuthenticated={setIsAuth} component={null}/>}/>
                                <Route path="/signin"
                                       element={<AuthPage setIsAuthenticated={setIsAuth} component={SignInForm}/>}/>
                                <Route path="/signup"
                                       element={<AuthPage setIsAuthenticated={setIsAuth} component={SignUpForm}/>}/>
                                <Route path="/pay" element={<PaymentPage/>}/>
                                <Route path="/organization/:orgId" element={<OrganizationPage/>}/>
                                <Route path="/ticket/send/" element={<TicketPage/>}/>
                                <Route path="/lot/:lotId" element={<LotPage/>}/>
                                <Route path="/ticket" element={<RegistrationTicketsAdminPage/>}/>
                                <Route path="/organizations/" element={<OrganizationsPage/>}/>
                                <Route path="/manageOrgs" element={<AdminOrganizationsPage/>}/>
                                <Route path="/getSeats" element={<UserSeatsComponent bets={[]} participants={[{},{},{},{}]}/>}/>
                                <Route
                                    path="/"
                                    element={<ProtectedRoute component={MainPage}
                                                             isAuthenticated={() => authUtils.isUserAuthenticated()}/>}
                                />
                                <Route
                                    path="/owned"
                                    element={<ProtectedRoute component={OwnedLots}
                                                             isAuthenticated={() => authUtils.isUserAuthenticated()}/>}
                                />
                            </Routes>
                        </div>
                    </div>
                </main>
            </>
        </div>
    )
        ;
}

export default App;
