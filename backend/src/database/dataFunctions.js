const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const mysql = require('mysql2');

// Updated readCSV function to handle CSV data from the request body
exports.readCSV = (csvData) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const readableStream = require('stream').Readable.from([csvData]);

        readableStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

exports.transformData = async (data) => {
   const ErrorReg = [];
   let TotalError = 0;

   const checkError = (item , data , number , reg ) =>{
          if(typeof item[data] === 'undefined' || item[data] == "#REF!"){
            item[data] = "Error";
            TotalError++;
            ErrorReg.push(reg);
            return;
          }
          if(number && Number.isNaN(parseFloat(item[data]))){
            item[data] = "Error";
            TotalError++;
            ErrorReg.push(reg);
            return;
          }
   }

   const twoDigit = (num , dig) =>{
     if(isNaN(num.toFixed(dig))){
       return "Error";
     }
     
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
     
   }

    const transformedData = data.map(item => {
        const subjects = [];
        const subjectCodes = [];
        const subjectGPS = [];
        const subCredits = [];
        const subGrades = []
        let i = 1;
        while (item[`Sub Code${i}`] || item[`Sub Name${i}`]) {
            if (item[`Sub Code${i}`]) {
                checkError(item ,`Sub Code${i}` , false,item['ENROLEMENT NO']);
                subjectCodes.push(item[`Sub Code${i}`]);
            }
            if (item[`Sub Name${i}`]) {
              checkError(item ,`Sub Name${i}` , false,item['ENROLEMENT NO']);                
              subjects.push(item[`Sub Name${i}`]);
            }
            if (item[`GP${i}`]) {
              checkError(item ,`GP${i}`, true,item['ENROLEMENT NO']);
              subjectGPS.push(item[`GP${i}`]);
            }

            if(item[`TCr${i}`]) {
              checkError(item,`TCr${i}`, true,item['ENROLEMENT NO']);
              subCredits.push(item[`TCr${i}`]);
            }

            if (item[`LG${i}`]) {
              checkError(item,`LG${i}`, false,item['ENROLEMENT NO']);
              subGrades.push(item[`LG${i}`]);
            }


            i++;
        }

        checkError(item,'ENROLEMENT NO', true,item['ENROLEMENT NO']);
        checkError(item,'STUDENT NAME', false,item['ENROLEMENT NO']);
        checkError(item,'STATUS', false,item['ENROLEMENT NO']);
        checkError(item,'% BASED ON SGPA', true,item['ENROLEMENT NO']);


        return {
            'ENROLEMENT NO': item['ENROLEMENT NO'],
            studentName: item['STUDENT NAME'],
            COLLEGE: item.COLLEGE,
            COURSE: item.COURSE,
            semester: item.SEMESTER,
            subjectCodes: subjectCodes,
            subjects: subjects,
            gps: subjectGPS,
            grades:subGrades,
            credits:subCredits,
            status: item.STATUS,
            percentage: twoDigit(parseFloat(item['% BASED ON SGPA'],2)), // Show '% BASED ON SGPA' instead of SGPA
            sgpa:twoDigit(parseFloat(item['% BASED ON SGPA']/10),2),
            'EXAMINATION M/YR':item['EXAMINATION M/YR']
        };
    });

    return {'data':transformedData , 'error':{'err':ErrorReg , 'total' : TotalError}};
};

// Function to establish and return a MySQL connection pool
exports.connectDatabase = () => {
    const pool = mysql.createPool({
      host: process.env.HOST,
      port: process.env.SQL_PORT,
      user: process.env.USER,
      password: process.env.PASS,
      database: process.env.DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  
    // Test the database connection
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL database:', err);
        throw err; // Throw error to terminate application or handle appropriately
      }
      console.log('Connected to MySQL database');
      connection.release(); // Release the connection back to the pool
    });
  
    return pool;
}



exports.createTable = (db) =>{
  // Create 'result' table if it doesn't exist
const createTableQuery = `CREATE TABLE IF NOT EXISTS result(
    enrollment_no VARCHAR(255) NOT NULL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    semester VARCHAR(255) NOT NULL,
    subject_codes JSON,
    subjects JSON,
    gps JSON,
    grades JSON,
    credits JSON,
    status VARCHAR(50) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    sgpa DECIMAL(5, 2) NOT NULL,
    exam_month_year VARCHAR(50) NOT NULL
  )`;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table "result" created or already exists');
    }
  });
}
