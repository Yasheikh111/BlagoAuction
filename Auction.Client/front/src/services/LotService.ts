import {Axios} from "axios";
import axios from "axios";
import authUtils from "./authUtils";

class LotService{
    public apiPath: string = "http://localhost:8080/api/lots/"
    private authToken: string = authUtils.getUser().token
    public axios: Axios = axios

    public constructor() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`
    }
    public static GetService(): LotService {
        return new LotService();
    }
}

export default LotService