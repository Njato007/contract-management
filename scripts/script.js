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

const ar = [
{country: "Afghanistan", ref: 40401},
{country:'African Oil Exporters', ref: 57215},
{country:"African Regional Organizations", ref: 76902},
{country:"Albania", ref: 15105},
{country:"Algeria", ref: 50105},
{country:"Angola", ref: 50202},
{country:"Anguilla", ref: 30228},
{country:"Antigua and Barbuda", ref: 35203},
{country:"Argentina", ref: 30104},
{country:"Armenia", ref: 16519},
{country:"Aruba", ref: 35254},
{country:"AsianOil Exporters", ref: 46612},
{country:"Asian Regional Organizations", ref: 75906},
{country:"Australia", ref: 60089},
{country:"Austria", ref: 10189},
{country:"Azerbaijan", ref: 16527},
{country:"Bahamas", ref: 35319},
{country:"Bahrain", ref: 40703},
{country:"Bangladesh", ref: 40746},
{country:"Barbados", ref: 30155},
{country:"Belarus", ref: 16209},
{country:"Belgium", ref: 10251},
{country:"Bulgaria", ref: 15202},
{country:"Cambodia", ref: 41203},
{country:"Cameroon", ref: 51004},
{country:"Colombia", ref: 30503},
{country:"Congo Kinshasa", ref: 51705},
{country:"Costa Rica", ref: 30589},
{country:"Côte d'Ivoire (Ivory Coast)", ref: 53007},
{country:"Trinidad and Tobago", ref: 32409},
{country:"Tunisia", ref: 56707},
{country:"Turkey", ref: 12807},
{country:"Uganda", ref: 56804},
{country:"Ukraine", ref: 16403},
{country:"United Arab Emirates", ref: 46604},
{country:"United Kingdom", ref: 13005},
{country:"Uruguay", ref: 32603},
{country:"Uzbekistan", ref: 16705},
{country:"Vanuatu", ref: 61603},
{country:"Venezuela", ref: 32719},
{country:"British", ref: 35807},
{country:"Vietnam", ref: 46906},
{country: 'Yemen', ref: 47104}
]

module.exports = { genCode, sendCode, ar }