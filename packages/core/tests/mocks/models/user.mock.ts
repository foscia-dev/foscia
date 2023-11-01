import { attr, makeModel } from '@foscia/core';

export default class UserMock extends makeModel('users', {
  name: attr<string>(),
  email: attr<string>(),
}) {
}
