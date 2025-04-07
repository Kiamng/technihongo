import React from "react";

const CustomInput = ({ type = "text", ...props }) => {
    return (
        <input
            className="font-semibold text-base p-2 border border-gray-300 rounded bg-secondary"
            type={type}
            {...props}
        />
    );
};

export default CustomInput;
