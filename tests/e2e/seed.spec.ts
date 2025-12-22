import { test, expect } from '../fixtures/testFixtures';

test.describe('Test group', () => {
  test('seed', async ({ app }) => {
    await app.screens.login.navigate();
    await app.screens.login.login('vasyalibaba@gmail.com', 'Lr~7opKJ8');
    await app.screens.main.footer.clickMenuBtn();
  });
});