import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("employeeId") != undefined || !localStorage.getItem("employeeId")) {
            navigate("/user/dashboard");
        }
        else {
            navigate("/login");
        }
    })

    return (
        <div>Landing</div>
    )
}

export default Landing