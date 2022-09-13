const genCode = () => {
    let code = "";
    for (let i = 0; i <= 5; i++) {
        code += Math.floor(Math.random() * 10)
    }
    return code;
}

const sendCode = (transporter, to_email, code) => {
    
    var mailOptions = {
        from: process.env.MAIN_USER,
        to: to_email,
        subject: "Contract management",
        html: codeTemplate(code),
    };
    transporter.sendMail(mailOptions, function (error, info) {
        console.log(error || 'Message has been sent to ' + to_email)
        transporter.close();
    });
}

const codeTemplate = (code) => {
    return `Hi, <br><br>Use this code to reset your password: ${code} <br><br>Many thanks`
}

module.exports = { genCode, sendCode }