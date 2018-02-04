import { By } from 'selenium-webdriver';

export const S = {
    busy: By.className('busyBackground'),
    topbar: By.className('topbar'),
    userframe: By.className('userFrame'),
    optionByName: name => By.css(`option[value="${name}"]`),
    uf: {
      username: By.className('userName'),
      sendMoney: By.className('userManagementLink'),
      balance: By.css('.balance > b')
    },
    ld: {
      registerLink: By.className('registerLink'),
      signinLink: By.className('signinLink'),
      name: By.css('.loginDialog #LoginDialog_name'),
      mail: By.css('.loginDialog #LoginDialog_mail'),
      pass: By.css('.loginDialog #LoginDialog_pass'),
      pass2: By.css('.loginDialog #LoginDialog_pass2')
    },
    dashboard: By.className('dashboard'),
    quicklinks: By.className('quicklinks'),
    ql: {
        login: By.css('.quicklinks .fa-sign-in'),
        settings: By.css('.quicklinks .fa-cog'),
        logout: By.css('.quicklinks .fa-sign-out'),
        meal: By.css('.quicklinks .fa-plus')
    },
    dialog: {
        meal: By.className('createMeal'),
        login: By.className('loginDialog'),
        settings: By.className('settingsDialog'),
        price: By.className('PriceDialog'),
        dialog: By.className('dialog'),
        signup: By.className('SignUpDialog'),
        submit: By.className('submit'),
        confirm: By.className('confirmationDialog'),
        sendMoney: By.className('sendMoneyDialog'),
        cancel: By.className('cancel'),
        close: By.css('.dialog .fa-times')
    },
    pd: {
        priceInputs: By.css('.PriceDialog input'),
        finalize: By.className('finalize'),
        price: By.css('.paymentList .price'),
        state: By.css('.paymentList .state'),
        unpaid: By.className('fa-times'),
        paid: By.className('fa-check'),
        signups: By.css('.paymentList tr'),
    },
    sMd: {
        money: By.id('SendMoneyDialog_amount'),
        mail: By.id('SendMoneyDialog_mail')
    },
    cm: {
        name: By.id('SignUpDialog_name'),
        signup: By.id('SignUpDialog_signupLimit'),
        description: By.id('SignUpDialog_description'),
        imageInput: By.css('.createMeal input[type="file"]'),
        image: By.css('.createMeal .imageContainer img'),
        time: By.css('.createMeal .time input'),
        deadline: By.css('.createMeal .deadline input'),
        deadlineTime: By.css('.createMeal .deadline .timePicker'),
        daypicker: By.className('DayPicker'),
        day: (id) => By.xpath(`//div[contains(@class, 'DayPicker-Day') and contains(normalize-space(string(self::div)), '${id}')]`),
        today: By.className('DayPicker-Day--today'),
        option: By.className('additionalOption'),
        addOpt: By.className('addOption'),
        opt: {
            delete: By.className('delLink'),
            name: By.css('.name input'),
            type: By.css('.optionType select'),
            typeOptionByValue: (value) =>  By.css(`.optionType select > option[value="${value}"]`),
            value: By.css('.addValue input'),
            add: By.css('.addValue button'),
            deleteValue: (name) => By.xpath(`//ul[contains(@class, 'valueCloud')]/li[normalize-space(text())='${name}']/span`),
            deleteAllValues: By.css('.valueCloud .fa-times')
        }
    },
    sd: {
        name: By.id('SettingsDialog_name'),
        mail: By.id('SettingsDialog_mail')
    },
    su: {
        option: By.className('SignUpOption'),
        optionByName: name => By.xpath(`//div[contains(@class, 'SignUpOption') and contains(label, '${name}')]`),
        count: By.className('count'),
        select: By.className('optionSelect'),
        selectOptions: By.css('.optionSelect option'),
        yesno: By.css('input[type="radio"]'),
        user: By.className('signupName'),
        changeUser: By.className('editName'),
        cancelChange: By.css('.editName.cancel'),
        userInput: By.css('#SignUpDialog_name'),
        commentInput: By.css('#SignUpDialog_comment'),
        signupOptionByName: name => By.css(`option[value="${name}"]`)
    },
    dashboard: By.className('dashboard'),
    db: {
        meal: By.className('meal'),
        getMealByName: name => By.xpath(`//div[contains(@class, 'meal') and contains(.//span[contains(@class, 'name')], '${name}')]`),
        error: By.className('error'),
        closeError: By.css('.error .fa-times'),
        m: {
            titlebar: By.className('titlebar'),
            delete: By.css('.menuIcon.fa-trash'),
            pay: By.css('.menuIcon.fa-euro'),
            edit: By.css('.menuIcon.fa-pencil'),
            icons: By.css('.titlebar .menuIcon'),
            name: By.css('.titlebar .name'),
            image: By.css('.mealImage'),
            signup: By.css('.participate'),
            signups: By.css('.participantsList > li'),
            signupByUser: name => By.xpath(`//ul[contains(@class, 'participantsList')]/li[contains(.//span[contains(@class, 'name')], '${name}')]`),
            timeHour: By.css('.date b'),
            creator: By.css('.creator span'),
            description: By.css('.description'),
            signupLimit: By.css('.participation .limit')
        },
        su: {
            comment: By.css('.comment'),
            optionCount: By.css('.optionCount'),
            optionValue: By.css('.optionValue'),
            optionShow: By.css('.optionShow'),
            signupOptions: By.css('.signupOptions > li'),
            edit: By.className('edit'),
            cancel: By.className('cancel')
        }
    }
}
