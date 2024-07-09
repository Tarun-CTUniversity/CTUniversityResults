const mysql = require('mysql2/promise');

exports.getDataMiddleware = async (req, res, next) => {
    const regNo = req.params.regNo; // Assuming regNo is passed as a route parameter
    
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
    const connection = await pool.getConnection();
  
    try {
      // Query to fetch data based on enrollment number
      const query = 'SELECT * FROM result WHERE enrollment_no = ?';
      const [rows] = await connection.query(query, [regNo]);
        
      // Check if data exists for the given enrollment number
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Data not found' });
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
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  };