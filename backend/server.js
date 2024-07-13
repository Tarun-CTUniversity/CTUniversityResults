const app = require('./app');
const cors = require('cors')
const bodyParser = require('body-parser')
const {readCSV , transformData , createTable , connectDatabase } = require('./src/database/dataFunctions')
const {insertResults} = require('./src/database/insertResults')
const {getDataMiddleware} = require('./src/database/getData');


app.use(cors());

app.use(bodyParser.json());


const db = connectDatabase ();
createTable(db);


// Students Frontend
app.get('/getData/:REG_DOB', getDataMiddleware);

// app.get('/getData', async (req,res,next)=>{
//     console.log("trigger");
//     res.json({data:'Data'});
// });


// Examination Front End
app.post('/addFile', async (req, res, next) => {
    try {
        const csvData = req.body.csvData || req.body.data; // Handle both possible request body keys
        if (!csvData) {
            throw new Error('No CSV data provided');
        }
        
        const data = await readCSV(csvData);
        const transformedData = await transformData(data);
        res.send(transformedData);
    } catch (error) {
        next(error);
    }
});

app.post('/addResult' , async (req, res, next) =>{
    try {
        const results = req.body;
        insertResults(results)
        res.status(200).send("Sucessfull")
    } catch (error) {
        next(error);
    }
})

app.get('/:pass',async (req,res,next) =>{
    try{
        const pass = req.params.pass;
        if(pass === process.env.LOGIN_PASS){
            res.status(200).send({message:'Login Successfull'})
        }else{
            res.status(202).send({message:'Login Error'})
        }
    }catch(err){
        next(err)
    }
})

// Create server

app.listen(process.env.PORT, '192.168.124.197', () => {
    console.log(`Server is running on http://192.168.124.197:${process.env.PORT}`);
});

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on http://localhost:${process.env.PORT}`);
// });
