import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <nav style={{display: 'flex', justifyContent: 'flex-end', backgroundColor: '#FDC37E'}}>
            <Link to={".."}>
                <p className='f3 link dim underline pa3 pointer'>Sign Out</p>
            </Link>
        </nav>
    );
}

export default Navigation;