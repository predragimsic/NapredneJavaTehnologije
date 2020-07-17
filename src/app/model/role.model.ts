import { Actor } from './actor.model';
import { Content } from './content.model';
import { RoleID } from './roleID.model';

export class Role {

    constructor(public roleID: RoleID,
                public name: string,
                public image: string,
                public content: Content,
                public status: string) {
    }

}
