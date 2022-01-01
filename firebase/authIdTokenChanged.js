import React, { useEffect , useState } from 'react'
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

export default function AuthIdTokenChanged({children}){
    const {setUser} = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        firebase.auth().onIdTokenChanged((user)=>{
            if(user){
                const userData = mapUserData(user)
                setUserCookie(userData)
                setUser(userData)
            } else {
                removeUserCookie()
                setUser()
            }

            const userFromCookie = getUserFromCookie()

            if(userFromCookie){
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