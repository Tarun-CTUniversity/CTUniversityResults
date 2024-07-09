import  {  useState } from 'react';
import logo from '../assets/images/Ct_logo.png';

const FrontPage = ({setFrontPage , setRoll}) => {
    const [rollNo , setRollNo] = useState('');
    const handleSearch = () =>{
        if(rollNo.length === 8){
            setRoll(rollNo); 
            setFrontPage(false);
        }
        else{
          alert("Give proper Registration Number");
        }
    }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar with university name and logo */}
      <div className="p-4 flex items-center justify-between bg-blue-600">
        <div className="flex items-center w-full">
          <img src={logo} alt="CT University Logo" className="w-15 h-12 ml-5" />
          <h1 className="text-xl font-bold text-white text-center flex-grow">CT University Results : ETE June 2024</h1>
        </div>
      </div>
      {/* Main content section */}
      <div className="flex items-center justify-center top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute ">
        
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            
          <div className="mb-4">
            
            <label htmlFor="enrollment-number" className="block text-gray-700 font-semibold mb-2">
              Enrollment Number
            </label>
            <input
              type="number"
              id="enrollment-number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Registration number"
              onChange={(e)=>{setRollNo(e.target.value)}}
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default FrontPage;
