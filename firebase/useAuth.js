import {createContext, useContext, useEffect,useState} from 'react'
import {useRouter} from 'next/router'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import initFirebase from './initFirebase'
import {
    removeUserCookie,
    setUserCookie,
    getUserFromCookie,
} from './setUserCookies'
import {mapUserData} from './mapUserData'
import styles from '../styles/Home.module.css'

// initFirebase()

const authContext = createContext()

export function AuthProvider (props) {
    const [user, setUser] = useState(null)
    const router = useRouter()

    const logout = async () => {
        return firebase.auth().signOut().then(()=>{
            setUser()
            router.push('/')
        })
        .catch((e) => {
            console.log(e)
        })
    }
    
    // useEffect(() => {
        //Firebase updates the id token every hour, this
        //makes sure the react state and the cookie are
        //both kept up to date
        // const cancelAuthListener = firebase.auth().onIdTokenChanged((user)=>{
        //     if(user){
        //         const userData = mapUserData(user)
        //         setUserCookie(userData)
        //         setUser(userData)
        //     } else {
        //         removeUserCookie()
        //         setUser()
        //     }
        // })

        //Auth State Change
        // const authStateChanged = firebase.auth().onAuthStateChanged((user)=>{
        //     if(user){
        //         const userData = mapUserData(user)
        //         setUserCookie(userData)
        //         setUser(userData)
        //     } else {
        //         removeUserCookie()
        //         setUser()
        //     }
        // })

        // if(loading){
        //     return (
        //         <container className={styles.main}>Loading...
        //         </container>
        //     )
        // }

    //     const userFromCookie = getUserFromCookie()

    //     if(userFromCookie){
    //         setUser(userFromCookie)
    //         router.push('/')
    //         return
    //     }


    //     return () => {
    //         cancelAuthListener()
    //     }
    // }, [])

    const value = {user,setUser,logout}

    console.log('useAuth before return')
    console.log(value)

    return <authContext.Provider value={value} {...props}/>
}

export default function useAuth(){
    return useContext(authContext)
}

// const useUser = () => {
//     const [user, setUser] = useState()
//     const router = useRouter()

//     const logout = async () => {
//         return firebase.auth().signOut().then(()=>{
//             router.push('/')
//         })
//         .catch((e) => {
//             console.log(e)
//         })
//     }

//     useEffect(() => {
//         //Firebase updates the id token every hour, this
//         //makes sure the react state and the cookie are
//         //both kept up to date
//         const cancelAuthListener = firebase.auth().onIdTokenChanged((user)=>{
//             if(user){
//                 const userData = mapUserData(user)
//                 setUserCookie(userData)
//                 setUser(userData)
//             } else {
//                 removeUserCookie()
//                 setUser()
//             }
//         })

//         const userFromCookie = getUserFromCookie()
//         console.log('use user')
//         console.log(userFromCookie)
//         if(userFromCookie){
//             router.push('/')
//             return
//         }
//         setUser(userFromCookie)

//         return () => {
//             cancelAuthListener()
//         }
//     }, [])

//     return {user,logout}
// }

// export {useUser}