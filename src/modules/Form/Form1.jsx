import React, { useState } from 'react'
import Inp from '../../components/Inp'
import Button from '../../components/Button'

const Form1 = ({ isSignin = false, }) => {
    const [data, setData] = useState({
        ...(isSignin ? {
            email: '',
            password: ''
        }
            : {
                email: '',
                password: ''
            }
        ),

    })
    console.log("data-->", data);
    return (
        <div className=" bg-white-400 w-[400px] h-[550px] rounded-lg shadow-xl flex flex-col justify-center items-center gap-3">
            <div className="text-3xl font-bold text-gray-500">Welcome {isSignin && 'Back'}</div>
                <div className="text-1xl  text-gray-700">{isSignin ? 'Sign in to get explore' : 'Sign up now to get started'}</div>
            <form className=" flex flex-col items-center w-full">
                {!isSignin && <Inp label="Fullname" name="fullname" placeholder="Enter your name" value={data.fullName} onChange={(e) => setData({ ...data, fullname: e.target.value })} />}
                <Inp label="Email address" name="email" type="email" placeholder="Enter your email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                <Inp label="Password" name="password" type="password" placeholder="Enter your Password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                <Button value={isSignin ? 'Sign in' : 'Sign up'} type="submit"/>
            </form>


            {!isSignin ? <div>Already have an account ? <span className=" text-sky-500 underline cursor-pointer">Sign in</span></div> : <div>Didn't have an account ? <span className=" text-sky-500 underline cursor-pointer">Sign up</span></div>}

        </div>

    )
}

export default Form1
