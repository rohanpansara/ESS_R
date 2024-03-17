import React, { useEffect } from 'react'
import Base from "../components/Base";

const Leave = () => {
    useEffect(() => {
        document.title = "Leave | ESS"
    }, [])

    return (
        <>
            <Base page="leaves" />
            <div id="content">
                <main>

                </main>
            </div>
        </>
    )
}

export default Leave