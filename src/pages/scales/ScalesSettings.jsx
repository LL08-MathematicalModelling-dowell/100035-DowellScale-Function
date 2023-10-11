import React from "react";
import { useParams } from "react-router-dom";

const ScalesSettings = ()=>{
    const { slug } = useParams();
    return(
        <>
            <h1>{slug}</h1>
        </>
    )
}

export default ScalesSettings;