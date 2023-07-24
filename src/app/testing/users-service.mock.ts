import { of } from 'rxjs';
import { User } from '../shared/models/user.model';

export class UsersServiceMock {
  getUsers() {
    const users: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '',
        createdAt: '',
        status: true,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: '',
        createdAt: '',
        status: false,
      },
    ];
    return of(users);
  }
}
