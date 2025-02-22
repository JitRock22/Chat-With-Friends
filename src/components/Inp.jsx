import React from 'react'
import '../stylesheets/Inp.css'
const Inp = ({ label, name = "name", type, classname, isRequired = true, placeholder,value,onChange=()=>{} }) => {
  return (
    <div className="main">
      <label htmlFor={name} className=" text-1.5xl font-light text-white">{label}</label>
      <input id={name} type={type} placeholder={placeholder} required={isRequired} className={`bg-white rounded-lg  ${classname}`} value={value} onChange={onChange}/>
    </div>
  )

}


export default Inp
