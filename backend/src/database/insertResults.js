const mysql = require('mysql2/promise'); // Ensure you have installed mysql2

async function insertResults(results) {
    const pool = connectDatabase(); // Get MySQL connection pool
    const connection = await pool.getConnection();

    // Function to validate a single result object
    function validateResult(result) {
        let nanCount = 0;
        let validationErrors = [];

        for (const key in result) {
            if (typeof result[key] === 'number' && isNaN(result[key])) {
                nanCount++;
                validationErrors.push(`${key} is NaN`);
            } else if (typeof result[key] === 'object') {
                if (Array.isArray(result[key])) {
                    result[key].forEach((value, index) => {
                        if (typeof value === 'number' && isNaN(value)) {
                            nanCount++;
                            validationErrors.push(`${key}[${index}] is NaN`);
                        }
                    });
                } else {
                    for (const subKey in result[key]) {
                        if (typeof result[key][subKey] === 'number' && isNaN(result[key][subKey])) {
                            nanCount++;
                            validationErrors.push(`${key}.${subKey} is NaN`);
                        }
                    }
                }
            }
        }

        return { nanCount, validationErrors };
    }

    try {
        // Start transaction
        await connection.beginTransaction();

        let totalNanCount = 0;
        let validationResults = [];

        // Iterate through each result and validate then insert into 'result' table
        for (let item of results) {
            // Validate the item
            const validationResult = validateResult(item);
            totalNanCount += validationResult.nanCount;
            if (validationResult.validationErrors.length > 0) {
                validationResults.push({ item, errors: validationResult.validationErrors });
                continue; // Skip insertion if validation fails
            }

            // Convert arrays to JSON strings
            const resultData = {
                enrollment_no: item['ENROLEMENT NO'],
                student_name: item['studentName'],
                college: item.COLLEGE,
                course: item.COURSE,
                semester: item.semester,
                subject_codes: JSON.stringify(item.subjectCodes),
                subjects: JSON.stringify(item.subjects),
                gps: JSON.stringify(item.gps),
                grades: JSON.stringify(item.grades),
                credits: JSON.stringify(item.credits),
                status: item.status,
                percentage: item.percentage,
                sgpa: item.sgpa,
                exam_month_year: item['EXAMINATION M/YR']
            };

            // Insert the result record with ON DUPLICATE KEY UPDATE
            const insertQuery = `
                INSERT INTO result SET ?
                ON DUPLICATE KEY UPDATE
                    student_name = VALUES(student_name),
                    college = VALUES(college),
                    course = VALUES(course),
                    semester = VALUES(semester),
                    subject_codes = VALUES(subject_codes),
                    subjects = VALUES(subjects),
                    gps = VALUES(gps),
                    grades = VALUES(grades),
                    credits = VALUES(credits),
                    status = VALUES(status),
                    percentage = VALUES(percentage),
                    sgpa = VALUES(sgpa),
                    exam_month_year = VALUES(exam_month_year)
            `;

            await connection.query(insertQuery, resultData);
        }

        // Commit transaction
        await connection.commit();
        console.log('All results inserted successfully');

        return { success: true, totalNanCount, validationResults };
    } catch (error) {
        await connection.rollback();
        console.error('Error inserting results:', error);
        throw error;
    } finally {
        connection.release();
    }
}

function connectDatabase() {
    // MySQL connection pool
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

    return pool;
}

module.exports = { insertResults, connectDatabase };
