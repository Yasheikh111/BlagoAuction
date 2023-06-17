import React, {ReactEventHandler, SyntheticEvent, useState} from 'react';
import { Form } from 'react-bootstrap';
import LotService from "../services/LotService";

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
        console.log(event.target.value)
        
        props.setSelectedOrganization(Number(event.target.value));
        console.log("Selected.")
    };

    return (
        <Form>
            <Form.Label>Організація:</Form.Label>
            <Form.Control
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Пошук"
            />
            <select onChange={handleSelect} >
                <option hidden={true}></option>
                {searchResults.map( org =>
                    <option key={org.id} value={org.id} >{org.name}</option>)
                }
            </select>
        </Form>
    );
};

export default SearchComponent;