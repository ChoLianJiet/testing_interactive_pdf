import '../styles/globals.css'
import {AuthProvider} from '../firebase/useAuth'
import AuthStateChanged from '../firebase/authStateChanged'
import AuthIdTokenChanged from '../firebase/authIdTokenChanged'
import initFirebase from '../firebase/initFirebase'

initFirebase()

function MyApp({ Component, pageProps }) {
  return (
    <>
    <AuthProvider>
      <AuthStateChanged>
        <AuthIdTokenChanged>
          <Component {...pageProps} />
        </AuthIdTokenChanged>
      </AuthStateChanged>
    </AuthProvider>
  </>
  )
}

export default MyApp
