export class Staff {

    staffId: number;
    username: string;
    name: string;
    password: string;
    created_at: Date;

    constructor(staffId?: number, username?: string, name?: string, password?: string, created_at?: Date) {
        this.staffId = staffId;
        this.username = username;
        this.name = name;
        this.password = password;
        this.created_at = created_at;
    }
}
