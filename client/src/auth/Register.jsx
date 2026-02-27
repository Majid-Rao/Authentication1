import React, { useState } from 'react'
import axios from 'axios'
const Register = () => {
    const [name,setName ] = useState();
    const [email,setEmail ] = useState();
    const [password,setPassword ] = useState();
    const handleSubmit = (e)=>{
    e.preventDefault();
    axios.post('',{name,email,password})
    .then((response)=>console.log(response)
    .catch((err)=>console.log(err)
    )
    )
    }

  return (
    <div className='h-[500px] w-[500px] bg-white justify-center flex m-auto mt-14'>
     <form onSubmit={handleSubmit}>
    <div className='bg-green-600 h-full w-full py-6 px-4'>
    
    <input type="text" placeholder='Name' onChange={(e)=>setName(e.target.value)} /><br/><br/>
    <input type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} /><br/><br/>
    <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} /><br/><br/>
    <button>Submit</button>
    </div>
    
    </form> 
    </div>
  )
}

export default Register
