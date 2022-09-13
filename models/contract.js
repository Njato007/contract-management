var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'contract_mngmt'
    /* online sql
    host     : 'sql8.freesqldatabase.com',
    user     : 'sql8517601',
    password : 'YQ3DQw9Fde',
    database : 'sql8517601' */
});

connection.connect(err => { if (err) console.log(err) } );

async function getContracts(id) {
    const promise = new Promise((resolve, reject) => {
        connection.query("SELECT client_ref as 'Client Ref', email as 'Email address', country_ref as 'Country Ref', country as 'Country', monthly_rent as 'Monthly Rent', c_index as 'Index', start_date as 'Start Date', end_date as 'End Date', segment as 'Segment', pdf_contract as 'PDF' FROM contract" + (id ? " WHERE client_ref=" + id : ''), async function (error, res, fields) {
          if (error) { 
            console.log (error);
            reject(error)
          }
          resolve({ values: res, fields: fields })
        });
    })
    return promise;
}

async function getClosestContracts() {
    const promise = new Promise((resolve, reject) => {
        connection.query("SELECT *, datediff(date(end_date), date(now())) as day_remaining FROM `contract` WHERE datediff(date(end_date), date(now())) <= 7 and datediff(date(end_date), date(now())) > 0;", async function (error, res, fields) {
          if (error) throw error;
          resolve(res)
        });
        // SELECT * FROM contract where date(end_date) = (select min(date(end_date)) from contract where date(end_date) > date(now()));
        // SELECT * FROM `contract` WHERE datediff(date(end_date), date(now())) <= 5;
    })
    return promise;
}

async function setUpdateContract(id, data) {
    // update statment
    let sql = `UPDATE contract SET ${data.keys} WHERE ${data.primary}`;
    console.log(sql);

    data.values.push(id);

    // execute the UPDATE statement
    const promise = new Promise((resolve, reject) => { 
        connection.query(sql, data.values, (error, results, fields) => {
            if (error){
                reject(error)
                return console.error(error.message);
            }
            console.log('Rows affected:', results.affectedRows);
            resolve(results.affectedRows)
        });
    })

    return promise;
}

// login
// create table login
async function createTableUser() {
    const promise = new Promise((resolve, reject) => {
        var sql = "CREATE TABLE IF NOT EXISTS user_cust (id INT(255) AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(500) NOT NULL, type ENUM('admin', 'other') DEFAULT 'other')";
        connection.query(sql, function (err, result) {
          if (err) {
            resolve(false)
            throw err;
          }
          console.log("Table created user_cust");
          resolve(true)
        });
    })
    return promise;
}

async function selectTableUsers() {
  const promise = new Promise((resolve, reject) => {
      var sql = "SELECT id as 'Identifiant', username as 'Email address', type as 'Type of user' FROM user_cust";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          resolve(false)
          throw err;
        }
        resolve({ values: result, fields: fields })
      });
  })
  return promise;
}

async function selectTableUser(data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "SELECT * FROM user_cust WHERE id=?";
      connection.query(sql, data, function (err, result, fields) {
        if (err) {
          resolve(false)
          throw err;
        }
        resolve(result)
      });
  })
  return promise;
}
// insert into user_cust
async function insertTableUser(data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "INSERT INTO user_cust VALUES (null, ?, ?, ?)";
      connection.query(sql, data, function (err, result) {
        if (err) {
          resolve(false)
          throw err;
        }
        console.log("Data inserted to user_cust", data);
        resolve(true)
      });
  })
  return promise;
}

// update from user_cust
async function updateTableUser(stringField, data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "UPDATE user_cust SET "+ stringField + " WHERE id=?";
      connection.query(sql, data, function (err, result) {
        if (err) {
          resolve(false)
          throw err;
        }
        console.log("Data updated to user_cust", data);
        resolve(true)
      });
  })
  return promise;
}

// update from user_cust
async function updateTableUserEmail(data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "UPDATE user_cust SET password=? WHERE id=?";
      connection.query(sql, data, function (err, result) {
        if (err) {
          resolve(false)
          throw err;
        }
        console.log("Data updated to user_cust", data);
        resolve(true)
      });
  })
  return promise;
}

// delete from user_cust
async function deleteTableUser(data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "DELETE FROM user_cust WHERE id=?";
      connection.query(sql, data, function (err, result) {
        if (err) {
          resolve(false)
          throw err;
        }
        console.log("Data deleted to user_cust", data);
        resolve(true)
      });
  })
  return promise;
}


// create table email_sent
async function createTableEmailSent() {
    const promise = new Promise((resolve, reject) => {
        var sql = "CREATE TABLE IF NOT EXISTS email_sent (id INT(255) AUTO_INCREMENT PRIMARY KEY, to_email VARCHAR(255) NOT NULL, date DATE NOT NULL)";
        connection.query(sql, function (err, result) {
          if (err) {
            resolve(false)
            throw err;
          }
          console.log("Table created email_sent");
          resolve(true)
        });
    })
    return promise;
}
// insert into email_sent
async function insertTableEmailSent(data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "INSERT INTO email_sent VALUES (null, ?, ?)";
      connection.query(sql, data, function (err, result) {
        if (err) {
          resolve(false)
          throw err;
        }
        console.log("Data inserted to email_sent", data);
        resolve(true)
      });
  })
  return promise;
}

// select from email_sent
async function selectTableEmailSent(data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "SELECT *, datediff(date(date), date(now())) as day FROM email_sent WHERE to_email=? LIMIT 1";
      connection.query(sql, data, function (err, result) {
        if (err) {
          resolve(false)
          throw err;
        }
        resolve(result)
      });
  })
  return promise;
}

// select from email_sent
async function updateTableEmailSent(data) {
  const promise = new Promise((resolve, reject) => {
      var sql = "UPDATE email_sent SET date=? WHERE id=?";
      connection.query(sql, data, function (err, result) {
        if (err) {
          resolve(false)
          throw err;
        }
        console.log("Data updated to email_sent", data);
        resolve(true)
      });
  })
  return promise;
}

async function checkLogin(data) {
  let sql = "SELECT * FROM user_cust WHERE username=? and password=?;"
  const promise = new Promise((resolve, reject) => {
      connection.query(sql, data, async function (error, res, fields) {
        if (error) {
          reject(error)
          throw error;
        }
        resolve(res)
      });
  })
  return promise;
}

async function checkEmail(data) {
  let sql = "SELECT * FROM user_cust WHERE username=?;"
  const promise = new Promise((resolve, reject) => {
      connection.query(sql, data, async function (error, res, fields) {
        if (error) {
          reject(error)
          throw error;
        }
        resolve(res)
      });
  })
  return promise;
}

module.exports = { 
  getContracts, setUpdateContract, getClosestContracts, checkLogin, createTableUser,
  createTableEmailSent, insertTableEmailSent, selectTableEmailSent, updateTableEmailSent,
  selectTableUser, insertTableUser, updateTableUser, selectTableUsers, deleteTableUser,
  checkEmail, updateTableUserEmail
}