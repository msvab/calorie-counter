const timeout = 5000

module.exports = {
  'Login, create a meal and see it in the list' : function (browser) {
    browser
        .url('https://calorie-counter-ms.herokuapp.com')
        // log in
        .waitForElementVisible('form', timeout)
        .setValue('input[name=login]', 'pepa')
        .setValue('input[name=password]', 'pepa')
        .click('#login-form button')
        // add meal
        .waitForElementVisible('table', timeout)
        .useXpath()
        .click("//button[contains(text(), 'Add Meal')]")
        .useCss()
        .waitForElementVisible('input[name=calories]', timeout)
        .setValue('input[name=name]', 'carrot cake')
        .setValue('input[name=calories]', '290')
        .useXpath()
        .click("//*[contains(text(), 'Save')]")
        // check if it appears in the table
        .waitForElementVisible("//table//tr/td[position() = 2 and contains(text(), 'carrot cake')]", timeout)
        .end();
  }
};