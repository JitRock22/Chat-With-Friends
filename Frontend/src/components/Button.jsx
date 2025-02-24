import React from 'react'
import '../stylesheets/Button.css'
const Button = ({ value, type }) => {
  return (
    <div className="btn rounded-lg">
      <button className=" text-white font-bold rounded-lg">{value}</button>
    </div>
  )
}

export default Button
