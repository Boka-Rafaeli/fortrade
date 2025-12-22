import { test } from './fixtures/testFixtures';
import { describe } from 'node:test';

describe('Test group', () => {
  test('seed', async ({ app }) => {
    // generate code here.
    await app.open('/#login');
    await app.screens.login.login('vasyalibaba@gmail.com', 'Lr~7opKJ8');
    await app.screens.main.footer.clickMenuBtn();

  });
});
