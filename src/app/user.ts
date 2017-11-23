export interface Roles {
    basic: boolean;
    admin?: boolean;
}
export class User {
    email: string;
    photoURL: string;
    roles: Roles;
    uid: string;
    displayName: string;

    constructor(authData) {
        this.email = authData.email;
        this.photoURL = authData.photoURL;
        this.uid = authData.uid;
        this.displayName = authData.displayName;
        this.roles = { basic: true };
    }
}