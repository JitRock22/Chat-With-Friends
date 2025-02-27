
import React from 'react'
import '../stylesheets/Contacts.css'

const Contacts = ({ name, image, status, onClick }) => {
    return (
        <div className=" main" onClick={onClick}>
            <div className=" flex justify-center items-center gap-5">
                <img src={image} alt="Profile Picture" width={60} height={60} className=" rounded-full" />
                <div className="">
                    <h3 className=" text-1xl font-medium">{name}</h3>
                    <p className=" font-light text-green-700">{status}</p>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default Contacts
