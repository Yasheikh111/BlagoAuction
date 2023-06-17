class UserLogInCredentials {
    constructor(email: string, password: string) {
        this.Email = email;
        this.Password = password;
    }

    private Email: string;
    private Password : string;
}
export default UserLogInCredentials;