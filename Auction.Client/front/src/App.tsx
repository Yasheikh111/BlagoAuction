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

function App() {
    const [isAuth,setIsAuth] = useState(false);
    const [isHidden,setIsHidden] = useState(true);
    const navigate = useNavigate();
    const onLogoSelect = () =>{
        setIsHidden(false)
        return () => setIsHidden(true)
    }
    
    return (
    <div  className="App h-100">

        <div className="bg bg-white"></div>
            
        <div className="d-flex flex-column p-0 rounded-t-none container position-relative h-100">
            
            <div   className="row h-100 text-dark justify-content-center align-content-center">
                <Navbar variant="dark"  className="w-75 align-self-center justify-content-center me-5 ms-5 d-flex sticky-top fixed-top p-0 rounded-2 align-top" bg="dark">
                    <Container>
                        <Navbar.Brand className="border-1px font-extrabold pe-4 ps-4 shadow-md hover:bg-red-400 m-1 shadow-t shadow-red-400 rounded-5 p-1" href="/">
                            Blago 
                            <span className="ms-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-600">🇺</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">🇦</span>
                        </Navbar.Brand>
                        { authUtils.isUserAuthenticated()
                            ? <>
                                <Navbar.Toggle onClick={() => navigate("/organizations/")} className="text-md text-light d-flex ms-3 me-auto">Організації</Navbar.Toggle>
                                <UserMiniProfile setIsAuthenticated={setIsAuth}></UserMiniProfile>
                            </>
                            : null
                        }
                    </Container>
                </Navbar>
                <div style={{minHeight: "fit-content",maxHeight: "90%"}} className="d-flex flex-column bg-light h-100 text-black overflow-visible shadow w-75 align-content-center">
            
            <Routes>
                <Route path="/createOrg" element={<OrganizationCreationPage/>} />
                <Route path="/create" element={<LotCreationPage/>}/>
                <Route path="/lots" element={<AdminLotsPage/>}/>
                <Route path="/login" element={<AuthPage setIsAuthenticated={setIsAuth} component={null}/>}  />
                <Route path="/signin" element={<AuthPage setIsAuthenticated={setIsAuth} component={SignInForm} />} />
                <Route path="/signup" element={<AuthPage setIsAuthenticated={setIsAuth} component={SignUpForm}/>} />
                <Route path="/pay" element={<PaymentPage />} />
                <Route path="/organization/:orgId" element={<OrganizationPage />} />
                <Route path="/ticket/send/" element={<TicketPage />} />
                <Route path="/lot/:lotId" element={<LotPage/>} />
                <Route path="/ticket" element={<RegistrationTicketsAdminPage />} />
                <Route path="/organizations/" element={<OrganizationsPage />} />
                <Route path="/manageOrgs" element={<AdminOrganizationsPage />} />
                <Route
                    path="/"
                    element={<ProtectedRoute component={MainPage} isAuthenticated={() => authUtils.isUserAuthenticated()} />}
                />
                <Route
                    path="/owned"
                    element={<ProtectedRoute component={OwnedLots} isAuthenticated={() => authUtils.isUserAuthenticated()} />}
                />
            </Routes>
                    
            </div>
                <footer className="w-75 p-0">
                    <Navbar variant=""  className=" align-self-center me-auto ms-auto d-flex justify-content-center d-flex p-0 rounded-2 align-top" bg="dark">
                        <Container className="bg-slate-600">
                            <Navbar.Brand onClick={() => navigate("ticket/send/")} className="d-flex">
                                <Image onMouseLeave={() => setIsHidden(true)} onMouseEnter={onLogoSelect} className="w-8 m-1" src={ReactLogo}></Image>
                                <span hidden={isHidden} className="m-1 ease-in">Звязок з адміністратором</span>
                            </Navbar.Brand>
                        </Container>
                    </Navbar>
                </footer>
        </div>
            
        </div>
        </div>
        
  );
}

export default App;
