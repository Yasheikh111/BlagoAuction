import React, {ReactEventHandler, SyntheticEvent, useState} from 'react';
import {Form, ListGroupItem} from 'react-bootstrap';
import LotService from "../services/LotService";
import ListGroup from "react-bootstrap/ListGroup";

const SearchComponent: React.FC<{ setSelectedOrganization:Function }> = (props: {setSelectedOrganization:Function}) => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [orgId, setOrgId] = useState<number>(0);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        
        setSearchText(value);
        if (value.length < 4)
            return
        // Perform search logic here, e.g., make an API call or search in local data
        let service = LotService.GetService();
        service.axios.get("http://localhost:8080/api/organization/match/" + searchText)
            .then( response =>{
                setSearchResults(response.data);
            })
            .catch( err => {
                console.log(err);
            });
    };

    const handleSelect = (event : any) => {
        console.log(event.target.id)
        
        props.setSelectedOrganization(Number(event.target.id));
        console.log("Selected.")
        setOrgId(Number(event.target.id))
    };

    return (
        <Form className="w-75 mx-auto">
            <Form.Label>Вибір організації:</Form.Label>
            <Form.Control
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Пошук"
            />
            <ListGroup className="m-4 mb-5 w-50 mx-auto mb-2 mt-2" onChange={handleSelect} >
                {searchResults.map( org =>
                    <ListGroupItem className={orgId === org.Id ? "bg-slate-100" : ""} 
                                   onClick={handleSelect} id={org.id} key={org.id} >{org.name}</ListGroupItem>)
                }
            </ListGroup>
        </Form>
    );
};

export default SearchComponent;