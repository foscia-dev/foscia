import { assembled, attr, fill, makeModel } from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe.concurrent('unit: assembled', () => {
  it('should memoized sync value', () => {
    const getterSpy = vi.fn((user: any) => (
      user.onlyUsername
        ? user.username
        : `${user.username} (${user.fullName})`
    ));

    const User = makeModel('users', {
      username: attr(() => ''),
      fullName: attr(() => ''),
      onlyUsername: attr(() => true),
      printableUsername: assembled(getterSpy),
    });

    const user = fill(new User(), {
      username: 'john',
      fullName: 'John Doe',
      onlyUsername: true,
    });

    expect(getterSpy.mock.calls.length).toBe(0);

    expect(user.printableUsername).toEqual('john');
    expect(getterSpy.mock.calls.length).toBe(1);
    expect(user.printableUsername).toEqual('john');
    expect(getterSpy.mock.calls.length).toBe(1);

    user.fullName = 'Jane Doe';

    expect(user.printableUsername).toEqual('john');
    expect(getterSpy.mock.calls.length).toBe(1);
    expect(user.printableUsername).toEqual('john');
    expect(getterSpy.mock.calls.length).toBe(1);

    user.username = 'jane';

    expect(user.printableUsername).toEqual('jane');
    expect(getterSpy.mock.calls.length).toBe(2);
    expect(user.printableUsername).toEqual('jane');
    expect(getterSpy.mock.calls.length).toBe(2);

    user.onlyUsername = false;

    expect(user.printableUsername).toEqual('jane (Jane Doe)');
    expect(getterSpy.mock.calls.length).toBe(3);
    expect(user.printableUsername).toEqual('jane (Jane Doe)');
    expect(getterSpy.mock.calls.length).toBe(3);
  });

  it('should memoized async value', async () => {
    const getterSpy = vi.fn(async (user: any) => user.username);

    const User = makeModel('users', {
      username: attr(() => ''),
      asyncUsername: assembled(getterSpy),
    });

    const user = fill(new User(), {
      username: 'john',
    });

    expect(getterSpy.mock.calls.length).toBe(0);

    expect(await user.asyncUsername).toEqual('john');
    expect(getterSpy.mock.calls.length).toBe(1);
    expect(await user.asyncUsername).toEqual('john');
    expect(getterSpy.mock.calls.length).toBe(1);
  });

  it('should get/set assembled value', () => {
    const User = makeModel('users', {
      firstName: attr(() => ''),
      lastName: attr(() => ''),
      fullName: assembled({
        get: (user) => `${user.firstName} ${user.lastName}`,
        set: (user, fullName) => {
          // eslint-disable-next-line no-param-reassign
          [user.firstName, user.lastName] = fullName.split(' ');
        },
      }),
    });

    const user = fill(new User(), {
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(user.fullName).toEqual('John Doe');

    user.fullName = 'Foo Bar';

    expect(user.firstName).toEqual('Foo');
    expect(user.lastName).toEqual('Bar');
    expect(user.fullName).toEqual('Foo Bar');
  });
});
