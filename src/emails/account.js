const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    console.log("email" + email)
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ACCOUNT,
        subject: 'Thanks for joining in Online Shop!',
        text: `Welcome . Let me know how you get along .`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ACCOUNT,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}
 

const sendContactEmail = (email,name, msg) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ACCOUNT,
        html:`<div>hello, ${name} ${msg}</div>`,
        subject: 'Online Shop!'
     })
    // sgMail.send({
    //     to: email,
    //     from: process.env.EMAIL_ACCOUNT,
    //     subject: 'Your Contact from Online Shop send !',
    //     text: `<div>`hello, ${name} thank you for contact us </div>`
    // })
}

module.exports = {
    sendContactEmail,
    sendWelcomeEmail,
    sendCancelationEmail
}
