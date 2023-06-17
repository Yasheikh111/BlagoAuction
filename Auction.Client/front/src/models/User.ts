class User{
    constructor(id:string,email: string, balance: number,token: string,role: Role) {
        this.Id = id;
        this.Email = email;
        this.Balance = balance;
        this.Token = token;
        this.Role = role;
    }

    public static validatedRole(user:any,requiredRole: string){
        return user.role === requiredRole;
    }

    Id: string;
    Balance: number
    Email: string;
    Token: string;
    Role: Role;
}
export default User;

export enum Role{
    User= "User",
    Admin="Admin",
    Moderator="Moderator",
}