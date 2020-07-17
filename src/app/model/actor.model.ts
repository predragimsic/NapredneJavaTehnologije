import { Role } from './role.model';

export class Actor {

    constructor(public id: number, public name: string, public aka: string,
                public biography: string, public dateOfBirth: Date,  public country: string,
                public height: number, public image: string, public roles: Role[]) {
    }

}
