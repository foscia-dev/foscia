import { makeActionClass } from '@foscia/core';

export default function makeFakeAction() {
  const ActionClass = makeActionClass();

  return new ActionClass();
}
