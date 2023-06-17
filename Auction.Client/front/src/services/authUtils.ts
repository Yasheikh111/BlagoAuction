import User, {Role} from "../models/User";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

class AuthUtils{
    public static getUser() : any{
        if (!this.isUserAuthenticated())
            return false
        let userStr : string =  sessionStorage.getItem("user") ?? ""
        return JSON.parse(userStr);
    }

    public static getUserId(): string{
        return this.getUser().id;
    }

    public static   isUserAuthenticated(): boolean{
        let user = sessionStorage.getItem("user")
        return user !== null && user !==''

    }
    public static emptyUser() : User {
        return new User("0","",5,"",Role.User);
    }

}

export default AuthUtils