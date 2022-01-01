import { useRouter } from 'next/router'
import React from 'react'
import useAuth from './useAuth'
import styles from '../styles/Home.module.css'

export function withPublic(Component){
    return function WithPublic(props){
        const auth = useAuth()
        const router = useRouter()

        if(auth.user){
            router.replace('/')
            return (
                <container className={styles.main}>Loading...
                </container>
            )
        }

        return <Component auth = {auth} {...props}/>
    }
}

export function withProtected(Component){
    return function WithProtected(props){
        const auth = useAuth()
        const router = useRouter()

        if(!auth.user){
            router.replace('/auth')
            return (
                <container className={styles.main}>Loading...
                </container>
            )
        }

        return <Component auth = {auth} {...props}/>
    }
}