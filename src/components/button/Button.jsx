
import React from "react"

const Button = ({ children, primary, width, ...props })=>{
    return(
        <button className={`w-${width} ${primary ? 'bg-primary text-white' : 'bg-gray-700/20'} hover:bg-gray-700/50 py-2 px-2 my-1`} {...props}>
            { children }
        </button>
    )
}

export default Button;