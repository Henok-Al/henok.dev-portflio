import React from "react"

const Button = ({ text, border, className, setShow }) => {
  return (
    <button
      className={`relative z-10 bg-[#ff4500] px-9 py-3 text-white shadow-lg transition-all duration-700 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-[-1] before:origin-left before:scale-x-0 before:bg-white before:transition-all before:duration-700 before:content-[""] hover:bg-white before:hover:scale-x-100 dark:bg-[#ff6b35] dark:before:bg-gray-200 dark:hover:bg-gray-200 ${border ? "hover:border-[3px] hover:border-[#ff4500] hover:text-black dark:hover:border-[#ff6b35]" : "border-none hover:text-black"} w-fit ${className || ""}`}
      onClick={() => {
        if (setShow) {
          setShow(true)
        }
      }}
    >
      {text}
    </button>
  )
}

export default Button
