import React, { useEffect } from 'react';
import logo from '../assets/images/Ct_logo.png';
import image from '../assets/images/CT_University_logo.png';

export default function Certificate({ certificateData }) {
  const textStyle = "text-[13px] font-semibold";
  const resStyle = "text-[13px] font-bold";

  const renderSubjectsTable = () => (
    <table className="w-full border-collapse border border-gray-300 mb-4 text-[13px]">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2">Sr. No.</th>
          <th className="border border-gray-300 px-4 py-2">Subject Code</th>
          <th className="border border-gray-300 px-4 py-2">Subject</th>
          <th className="border border-gray-300 px-4 py-2">Credit</th>
          <th className="border border-gray-300 px-4 py-2">Grade</th>
          <th className="border border-gray-300 px-4 py-2">Grade Point</th>
        </tr>
      </thead>
      <tbody>
        {certificateData.SUBJECT_CODES.map((subjectCode, index) => (
          <tr key={subjectCode} className="bg-white">
            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
            <td className="border border-gray-300 px-4 py-2">{subjectCode}</td>
            <td className="border border-gray-300 px-4 py-2">{certificateData.SUBJECTS[index]}</td>
            <td className="border border-gray-300 px-4 py-2">{certificateData.CREDITS[index]}</td>
            <td className="border border-gray-300 px-4 py-2">{certificateData.GRADES[index]}</td>
            <td className="border border-gray-300 px-4 py-2">{certificateData.GPS[index]}</td>
          </tr>
        ))}
        <tr className="bg-gray-100">
          <td className="border border-gray-300 px-4 py-2"></td>
          <td className="border border-gray-300 px-4 py-2 font-semibold">SGPA</td>
          <td className="border border-gray-300 px-4 py-2"></td>
          <td className="border border-gray-300 px-4 py-2"></td>
          <td className="border border-gray-300 px-4 py-2 font-semibold">{certificateData.SGPA}</td>
          <td className="border border-gray-300 px-4 py-2"></td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div id="printable-certificate" className="p-6 border flex flex-col border-gray-300 rounded shadow-md items-center">
      <div className="flex justify-center relative w-full">
        <img src={image} alt="CT University Logo" className="md:w-[120px] w-[80px]" />
        <p className="text-sm absolute top-[-5px] right-0 text-[12px] font-semibold">{certificateData.EXAM_MONTH_YEAR}</p>
      </div>
      <div className="text-center mb-4">
        <p className="sm:text-[15px] text-[13px] font-bold mt-2">{certificateData.COLLEGE}</p>
        <h2 className="text-[12px] mt-2 font-bold italic text-red-700">Result cum Grade Card</h2>
      </div>
      <div className="mb-4 w-full grid grid-cols-2 gap-4 p-2">
        <div className="flex flex-col">
          <p className={`${resStyle} text-left`}><span className={textStyle}>Enrollment Number:</span> {certificateData.ENROLLMENT_NO}</p>
          <p className={`${resStyle} text-left`}><span className={textStyle}>Student Name:</span> {certificateData.STUDENT_NAME}</p>
        </div>
        <div className="flex flex-col">
          <p className={`${resStyle} text-left`}><span className={textStyle}>Course:</span> {certificateData.COURSE}</p>
          <p className={`${resStyle} text-left`}><span className={textStyle}>Semester:</span> {certificateData.SEMESTER}</p>
        </div>
      </div>
      <p className={`${resStyle} -mt-4 mb-4`}><span className={textStyle}>Exam Year:</span> {certificateData.EXAM_MONTH_YEAR}</p>
      {renderSubjectsTable()}
      <p className={`font-bold ${certificateData.STATUS === 'PASS' ? 'text-green-500' : 'text-red-600'}`}>
        <span className="font-semibold text-black">Status:</span> {certificateData.STATUS}
      </p>
      <p className=' text-[12px] mt-4'>
        *This is computer genrated result. For other purposes kindly get approvel from COE office
      </p>
      
    </div>
  );
}
