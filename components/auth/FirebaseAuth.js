import initFirebase from "../../firebase/initFirebase"
import {useEffect, useState} from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import {setUserCookie} from '../../firebase/setUserCookies'
import authing from "../../firebase/useAuth"
import {mapUserData} from '../../firebase/mapUserData'

initFirebase()

const FirebaseAuthConfig = {
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    callbacks: {
        signInSuccessWithAuthResult: async ({user}, redirectUrl) => {
            const {setUser} = authing()
            const userData = mapUserData(user)
            setUserCookie(userData)
            setUser(userData)
        }
    }
}

const FirebaseAuth = () => {
    const [renderAuth, setRenderAuth] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined'){
            setRenderAuth(true)
        }
    }, [])
    return (
        <div>
            {
                renderAuth ? (
                    <StyledFirebaseAuth
                        uiConfig = {FirebaseAuthConfig}
                        firebaseAuth = {firebase.auth()}
                    />
                ) : null
            }
        </div>
    )
}

export default FirebaseAuth