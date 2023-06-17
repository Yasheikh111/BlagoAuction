class UserSignUp{
    constructor(Firstname: string, Surname: string, Email: string, Passwrod: string) {
        this.Firstname = Firstname;
        this.Surname = Surname;
        this.Email = Email;
        this.Password = Passwrod;
    }
    Firstname: string;
    Surname: string;
    Email: string;
    Password:string;
}

export default UserSignUp