
import { User } from '../auth/user.model';
import { Content } from './content.model';

export class Rating {
  constructor(public id: number, public user: User, public content: Content, public rate: number) {
  }
}