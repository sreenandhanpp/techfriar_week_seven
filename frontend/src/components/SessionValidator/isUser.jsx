import React from 'react';
import { useNavigate } from 'react-router-dom';

const isUser = ( { children} ) => {
    const user = getItem('user');
    const navigate = useNavigate();
    if(user){
        return children
    }else{
        navigate('/');
    }
    return (
        <div>

        </div>
    )
}

export default isUser
