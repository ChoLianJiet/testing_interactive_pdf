import firebase from 'firebase/compat/app'
import useAuth from '../../firebase/useAuth'

const LogoutButton = () => {
    const {logout} = useAuth()

    return (
        <>
            <button onClick={logout}>Logout</button>
        </>
    )
}

export default LogoutButton