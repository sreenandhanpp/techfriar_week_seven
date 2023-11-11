import { Route, Navigate, Outlet } from 'react-router-dom';
import { getItem } from '../../../localStorage/getItem';

const user = getItem('user');

const useAuth = () => {

    if (user) {
        return false;
    } else {
        return true;
    }
}
const PublicRoute = () => {
    const auth = useAuth();
    return auth ? <Outlet /> : user.admin? <Navigate to={'/dashboard'} /> :<Navigate to={'/'} />
};

export default PublicRoute;
