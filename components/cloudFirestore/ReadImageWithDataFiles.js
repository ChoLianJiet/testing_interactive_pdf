import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useRef,useState,useEffect } from 'react'
import useAuth from '../../firebase/useAuth'
import styles from '../../styles/Home.module.css'


const ReadImageWithData = () => {

    const db = firebase.firestore()
    const [query,setQuery] = useState(null)

    useEffect(()=>{
        if(!query){
            db.collection('my_images').onSnapshot( function (query){
                console.log(query)
                setQuery(query)
            })
        }
    },[])

 
    console.log('get static props')

    if(!query){
        return (
            <>Loading...
            </>
        )
    }

    return (
        <>
            <h1>Fetched Data</h1>
            {query.docs.map((doc)=>{
                return (
                    <div key={doc.id}>
                        <a>
                            <h3>{doc.data().filename}</h3>
                            <img src={doc.data().image_url} className={styles.img}/>
                        </a>
                    </div>
                )
            })}
        </>
    )
}

export default ReadImageWithData