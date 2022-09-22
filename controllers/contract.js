const { getContracts, setUpdateContract, getClosestContracts, checkLogin, createTableEmailSent, selectTableEmailSent, insertTableEmailSent, updateTableEmailSent, createTableUser, selectTableUser, insertTableUser, selectTableUsers, updateTableUser, deleteTableUser, checkEmail, updateTableUserEmail, insertContract, getActiveContract, getExpiredContract, getRents} = require("../models/contract")

createTableEmailSent()
createTableUser()

const nodemailer = require('nodemailer');
const md5 = require("md5");
const { genCode, sendCode, ar } = require("../scripts/script");
//Mailing
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIN_USER,
      pass: process.env.MAIN_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
});

const checkAuth = (req, res, next) => {
    if (req.session['login']) {
        return next()
    } else {
        res.redirect('/login')
    }
}

const checkAuth2 = (req, res, next) => {
    if (!req.session['login']) {
        return next()
    } else {
        res.redirect('/')
    }
}

const checkSentCode = (req, res, next) => {
    if (!req.session['forgot-code']) {
        backURL = req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
    } else {
        return next();
    }
}

const logout = (req, res) => {
    req.session['login'] = null;
    return res.redirect('/login');
}

const showIndex = async (req, res) => {
    let contracts = await getContracts(req.params.id)
    let closests = await getClosestContracts()
    console.log(req.session['login'])
    // send email to the client which their contract is getting close
    let newClosests = await sendEmail(req, res, closests);

    res.render('index', { contracts: contracts, closests: newClosests, login: false, active_user: req.session['login'] });
}

const showNotifs = async (req, res) => {
    let closests = await getClosestContracts()
    return res.render('notification', { closests: closests, login: false, active_user: req.session['login'] });
}

const showLogin = (req, res) => {
    return res.render('login', { login: true, message: null })
}

const postLogin = async (req, res) => {
    const {email, password} = req.body;
    const auth = await checkLogin([email, md5(password)])
    
    if (auth.length > 0) {
        req.session['login'] = auth[0];
        res.redirect('/');
    } else {
        res.render('login', { login: true, message: "Incorrect email or password" })
    }
}

const showForgot = (req, res) => {
    console.log(req.session['forgot-code'], req.session['id-user'])
    req.session['forgot-code'] = null;
    return res.render('forgot-password', { login: true, message: null })
}

const postForgot = async (req, res) => {
    // check email if exists
    let check = await checkEmail([req.body.email]);
    if (check.length > 0) {
        const code = genCode();
        req.session['forgot-code'] = code;
        req.session['id-user'] = check[0].id;
        sendCode(transporter, req.body.email, code);
        res.redirect('/enter-code');
    } else {
        res.render('forgot-password', { login: true, message: "Email not found! Please, try again." })
    }
}

const showAddUser = async (req, res) => {
    let closests = await getClosestContracts()
    return res.render('add-user', { closests: closests, login: false, active_user: req.session['login'] })
}

const postAddUser = async (req, res) => {
    const { email, password, type} = req.body;
    await insertTableUser([email, md5(password), type]);
    return res.redirect('/user-list');
}

const showUserList = async (req, res) => {
    const users = await selectTableUsers()
    let closests = await getClosestContracts()
    return res.render('user-list', { users: users, login: false, closests: closests, active_user: req.session['login'] });
}

const showEditUser = async (req, res) => {
    let user = await selectTableUser([req.params.id])
    let closests = await getClosestContracts()
    return res.render('edit-user', { user: user[0], login: false, closests: closests, active_user: req.session['login'] });
}

const postEditUser = async (req, res) => {
    const { email, password, type} = req.body;
    let field = password ? 'username=?, password=?, type=?' : 'username=?, type=?';
    let data = password ? [email,  md5(password), type, req.params.id] : [email, type, req.params.id];
    await updateTableUser(field, data);
    return res.redirect('/user-list');
}

const deleteUser = async (req, res) => {
    const data = [req.body.id];
    await deleteTableUser(data);
    return res.redirect('/user-list');
}

const showCode = async (req, res) => {
    return res.render('enter-code', { login: true, message: null });
}
const postCode = async (req, res) => {
    if (req.body.code === req.session['forgot-code']) {
        res.redirect('new-password');
    } else {
        return res.render('enter-code', { login: true, message: "Code invalid! Please, try again." });
    }
}

const showNewPassword = async (req, res) => {
    return res.render('new-password', { login: true, message: null });
}
const postNewPassword = async (req, res) => {
    if (req.body.password.length >= 4) {
        await updateTableUserEmail([md5(req.body.password), req.session['id-user']]);
        req.session['forgot-code'] = null;
        res.redirect('login');
    } else {
        return res.render('new-password', { login: true, message: "The password is too short! Please, try another" });
    }
}

const showDashboard = async(req, res) => {
    let contracts = await getContracts();
    let closests = await getClosestContracts();
    let activeContracts = await getActiveContract();
    let expiredContracts = await getExpiredContract();
    let date = new Date().toLocaleDateString();
    let rents = await getRents();
    let rentCurrency = rents.map(e => {
        for (let key of Object.keys(e)) {
            e[key] = new Intl.NumberFormat("en-US", { style: "currency", currency: 'USD'}).format(e[key])
        }
        return e;
    })
    return res.render('dashboard', { contracts: contracts, closests: closests,
        active_user: req.session['login'], login: false,
        active_contracts: activeContracts, expired_contracts: expiredContracts,
        date: date,
        rents: rentCurrency[0],
        topercent: (value, max) => value * 100 / max 
    });
    
}

/** */
const updateContract = async (req, res) => {
    let pdf_contract = null;
    let pdf_field = 'pdf_contract';
    const {old_pdf} = req.body;
    delete req.body.old_pdf;
    if (req.files) {
        let file = req.files[pdf_field]
        if (file) {
            filename = file.name.split('.pdf')[0] + Date.now() + '.pdf';
            console.log(filename)
            file.mv('uploads/pdf/' + filename);
            // delete old file name
            try {
                const fs = require('fs')
                fs.unlinkSync('uploads/' + old_pdf)
                console.log('uploads/' + old_pdf)
            } catch (error) {
                
            }
            pdf_contract = 'pdf/' + filename;
        }
    }

    const objectKeys = Object.keys(req.body);
    let keys = objectKeys.filter(e => e !== objectKeys[0]);
    let primary = objectKeys[0] + "=?";
    const objectValues = Object.values(req.body);
    let values = objectValues.filter(e => e !== objectValues[0] && e !== "undefined");
    if (pdf_contract) {
        keys.push(pdf_field)
        values.push(pdf_contract);
    } else { // remove pdf_contract column in keys
        keys.splice(keys.indexOf(pdf_field), 1);
    }
    let token = keys.join('=?, ') + '=?'
    const data = { keys: token, values: values, primary: primary }

    try {
        let uResp = await setUpdateContract(req.params.id, data);
        return res.send({
            status: true,
            rows: uResp,
            pdf_url: pdf_contract
        });
    } catch (err) {
        console.log(err)
        res.send({
            status: false
        });
    }
}

const sendEmail = async (req, res, data = []) => {

    let date = new Date()
    let formatedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    await data.forEach(async item => {
        // mail options
        var mailOptions = {
            from: process.env.MAIN_USER,
            to: item.email,
            subject: "Contract termination",
            html: emailTemplate(item),
        };
        let selectedEmail = await selectTableEmailSent([item.email]);
        // if some record found 
        if (selectedEmail.length == 1) {
            // id diff day less than 0
            if (selectedEmail[0].day < 0) {
                // do an update and send email
                await updateTableEmailSent([formatedDate, selectedEmail[0].id])
                await transporter.sendMail(mailOptions, function (error, info) {
                    // console.log(error ? error : info)
                    if (!error) {
                        console.log('Message has been sent to ' + selectedEmail[0].to_email)
                    } else {
                        console.log(error)
                    }
                    transporter.close();
                });
            } else {
                console.log('Already sent to ' + item.email)
                item['sent to'] = true;
            }
        } else {
            // insertion
            await insertTableEmailSent([item.email, formatedDate]);
            await transporter.sendMail(mailOptions, function (error, info) {
                if (!error) {
                    console.log('Message has been sent to ' + item.email)
                } else {
                    console.log(error)
                }
                transporter.close();
            });
        }
    });
    return data;
}

const emailTemplate = (data) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email template</title>
    </head>
    <!-- Complete Email template -->
    <body style="background-color:#fff">
        <table align="center" border="0" cellpadding="0" cellspacing="0"
            width="550" bgcolor="white" style="border:1px solid #454655">
            <tbody>
                <tr>
                    <td align="center">
                        <table align="center" border="0" cellpadding="0"
                            cellspacing="0" class="col-550" width="550">
                            <tbody>
                                <tr>
                                    <td align="center" style="background-color: #4b99ce;
                                            height: 50px;">
    
                                        <a href="#" style="text-decoration: none;">
                                            <p style="color:white;
                                                    font-weight:bold;">
                                                Contract Management
                                            </p>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr style="height: 180px;">
                    <td align="center" style="border: none;
                            border-bottom: 2px solid #454655;
                            padding-right: 20px;padding-left:20px">
    
                        <p style="font-weight: bolder;font-size: 32px;
                                letter-spacing: 0.023em;
                                color:#2e2f39;">
                            Dear client!
                            <br> Check out our infos
                        </p>
                    </td>
                </tr>
    
                <tr style="display: inline-block;">
                    <td style="height: 150px;
                            padding: 20px;
                            border: none;
                            border-bottom: 2px solid #2e2f39;
                            background-color: white;">
                        
                        <p class="data" style="text-align: justify-all;
                                align-items: center;
                                font-size: 15px;
                                font-family: 'century gothic';
                                padding-bottom: 12px; color: #2e2f39;">
                            <b>From : </b> <span>Contract management</span>
                            <br /><br />
                            <b>Date : </b> <span style="color: #000;">${new Date().toLocaleDateString()} </span>
                            <br /><br />
                            <b>To : </b> <span style="color: #000;">${data.email} </span>
                            <br /><br />
                            <b>Subject : </b>Contract Termination 
                            <br /><br />
                            This letter is to inform you that the contract, we made on <b>${new Date(data.start_date).toLocaleDateString()}</b> (date of the starting of the contract),
                            is going to be ended up by our company on the upcoming <b>${new Date(data.end_date).toLocaleDateString()} </b> (date of the end of the contract).
                            <br /><br />
                            You will be kindly requested to clear up all the dues to our company, and we will promise to do the same within the given
                            time.
                            <br /><br /><br />
                            Thanks
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    
    </html>`;
}

// for (let index = 1; index < 125; index++) {
//     let random = ar[Math.floor(Math.random() * ar.length)]
//     const data = {
//         keys: "country_ref=?, country=?",
//         primary: "client_ref=?",
//         values: [random.ref, random.country]
//     }
//     setUpdateContract(index, data);
// }

module.exports = { 
    showIndex, updateContract, showNotifs, emailTemplate, showLogin, showForgot,
    postLogin, showAddUser, postAddUser, showUserList, postEditUser, showEditUser,
    deleteUser, checkAuth, checkAuth2, logout, postForgot, showCode, postCode,
    showNewPassword, postNewPassword, checkSentCode, showDashboard
}