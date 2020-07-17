export class User {
    // tslint:disable-next-line: variable-name
    constructor(public id: number, public email: string, public password: string, private token: string, private name: string, private surname: string) {
    }

    get _token() {
        return this.token;
    }
}
