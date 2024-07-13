import React from 'react'
import logo from '../Assets/images/Ct_logo.png';
import GenerateExcelButton from './GenerateExcelButton';
import GenerateJsonFiles from './GenrateJsonFiles'

export default function NavBar() {
  return (
    <div className='navbar' style={
      {
        width:'100vw',
        backgroundColor:'#2563eb',
        position:'absolute',
        top:0,
        left:0,
        height:'75px',
        display:'flex'
      }
    }>
      <img src={logo} alt='CT Logo' style={
        {
          width:'5%',
          marginLeft:'50%'
        }
      }/>

      <GenerateExcelButton />
      <GenerateJsonFiles />

    </div>
  )
}
