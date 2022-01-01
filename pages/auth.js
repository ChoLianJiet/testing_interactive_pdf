import FirebaseAuth from '../components/auth/FirebaseAuth'
import {withPublic} from '../firebase/routes'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Auth = () => {
    return (
        <div className={styles.main}>
            <FirebaseAuth/>
            <p><Link href="/">Go Home</Link></p>
        </div>
    )
}

export default withPublic(Auth)