const mysql = require('mysql2/promise');
const { checkAuthenticity } = require('../checkAuthenticity');

exports.getDataMiddleware = async (req, res, next) => {
    const body = req.params.REG_DOB.split(',');
    
    const pool = mysql.createPool({
        host: process.env.HOST,
        port: process.env.SQL_PORT,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DATABASE,
        waitForConnections: true,
        connectionLimit: 500,
        queueLimit: 0
      });
    const connection = await pool.getConnection();

    const resp = await checkAuthenticity(body , connection);
    if(!resp.login){
      return res.json({success:false ,  error: ' Your Registration Number or Date Of Birth is wrong'});
    }
    const regNo = body[0];
  
    try {
      // Query to fetch data based on enrollment number
      const query = 'SELECT * FROM result WHERE enrollment_no = ?';
      const [rows] = await connection.query(query, [regNo]);
      
      // Check if data exists for the given enrollment number
      if (rows.length === 0) {
        return res.json({success:false , error: 'Your result is still not declared. Kindly check after some days for further updates.' });
      }
  
      // Assuming there's only one result since enrollment number is unique
      const data = rows[0];
      
      // Construct the response object as needed
      const responseData = {
        ENROLLMENT_NO: data.enrollment_no,
        STUDENT_NAME: data.student_name,
        COLLEGE: data.college,
        COURSE: data.course,
        SEMESTER: data.semester,
        SUBJECT_CODES: data.subject_codes,
        SUBJECTS: data.subjects,
        GPS: data.gps,
        CREDITS: data.credits,
        GRADES : data.grades,
        STATUS: data.status,
        PERCENTAGE: data.percentage,
        SGPA: data.sgpa,
        EXAM_MONTH_YEAR: data.exam_month_year
      };

      // console.log(responseData)
  
      res.json({success:true ,data:responseData});
    } catch (error) {
      console.error('Error fetching data:', error);
      res.json({success:false , error: 'Your result is still not declared. Kindly check after some days for further updates.' });
    } finally {
      if (connection) connection.release();
    }
  };
