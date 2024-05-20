
import React from "react"

const Button = ({ children, primary, width, disabled, ...props })=>{
    const className = disabled ? 'cursor-not-allowed bg-primary/40' : 'bg-primary'
    return(
        <button 
            className={`w-${width} ${primary ? `${className} text-white` : 'bg-gray-700/20'} hover:bg-gray-700/50 py-2 px-2 my-1`} 
            {...props}
            disabled={disabled}
            >
            { children }
        </button>
    )
}

export default Button;