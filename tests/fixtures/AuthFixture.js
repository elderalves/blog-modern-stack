export class AuthFixture {
  constructor(page) {
    this.page = page
  }

  async signUpAndLogIn() {
    const testUser = 'test' + Date.now()
    await this.page.goto('/signup')
    await this.page
      .getByRole('textbox', { name: 'Username: Password:' })
      .fill(testUser)
    await this.page.locator('#create-password').fill('test')
    await this.page.getByRole('button', { name: 'Sign up' }).click()

    await this.page.waitForURL('**/login')

    await this.page
      .getByRole('textbox', { name: 'Username: Password:' })
      .fill(testUser)
    await this.page.locator('#create-password').fill('test')
    await this.page.getByRole('button', { name: 'Log in' }).click()

    await this.page.waitForURL('**/')

    return testUser
  }
}
