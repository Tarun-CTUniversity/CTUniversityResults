import React from 'react';
import axios from 'axios';
import {HOST} from './constants'

export default function GenrateJsonFiles() {
    const generateJson = async() =>{
        const resp = await axios.get(`${HOST}/createJson`);
        if(resp.status==200){
            alert("Data Saved")
        }else{
            alert("Error While Saving Data")
        }
    }
    return (
        <div>
            <p style= {
                {
                    color:'white',
                    position:'absolute',
                    top:'10px',
                    right:'300px',
                    cursor:'pointer'
                }
            } onClick={generateJson}>Release Results</p>
        </div>
    );
}
