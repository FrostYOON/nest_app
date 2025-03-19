import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { encryptPassword } from 'src/utils/password-util';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const user = event.entity;

    if (user.password) {
      user.password = await encryptPassword(user.password);
    }
  }
}
