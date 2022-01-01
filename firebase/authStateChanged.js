import { useEffect , useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import {
    removeUserCookie,
    setUserCookie,
    getUserFromCookie,
} from './setUserCookies'
import {mapUserData} from './mapUserData'
import useAuth from './useAuth'
import styles from '../styles/Home.module.css'

export default function AuthStateChanged({children}){
    const {setUser} = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            console.log('auth state changed')
            console.log(user)
            if(user){
                const userData = mapUserData(user)
                console.log('user data')
                console.log(userData)
                setUserCookie(userData)
                setUser(userData)
            } else {
                console.log('no user data')
                removeUserCookie()
                setUser()
            }

            const userFromCookie = getUserFromCookie()

            if(userFromCookie){
                console.log('user from cookie')
                console.log(userFromCookie)
                setUser(userFromCookie)
            } else {
                // setUser()
            }

            setLoading(false)
        })
    },[])

    if(loading){
        return (
            <container className={styles.main}>Loading...
            </container>
        )
    }

    return children
}