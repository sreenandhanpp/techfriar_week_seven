import { Route, Navigate, Outlet } from 'react-router-dom';
import { getItem } from '../../../localStorage/getItem';

const useAuth = () => {
    // Check if user is logged in and has the required role
    const user = getItem('user');

    if (user) {
        return true;
    } else {
        return false;
    }
}
const UserRoute = () => {
    const auth = useAuth();
    return auth ? <Outlet /> : <Navigate to={'/login'} />
};

export default UserRoute;
