import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useRef,useState,useEffect } from 'react'
import useAuth from '../../firebase/useAuth'
import styles from '../../styles/Home.module.css'
import { table } from 'table';
import Link from 'next/link'


const GetPumps = () => {

    const db = firebase.firestore()
    const [query,setQuery] = useState(null)
    const [data,setData] = useState(null)

    useEffect(()=>{
        if(!query){
            db.collection('pumps').onSnapshot( async function (query){
                console.log(query)
                // setQuery(query)
                let data = []

                for(let i = 0 ; i < query.docs.length ; i ++){
                    let documentSnapshot = query.docs[i]
                    let seriesList = []
                    let seriesQuery = await db.collection('pumps').doc(documentSnapshot.id).collection('series').get()
                    for(let j = 0 ; j < seriesQuery.docs.length;j++){
                        let seriesSnapshot = seriesQuery.docs[j]
                        let seriesData = seriesSnapshot.data()
                        seriesData['id'] = seriesSnapshot.id
                        seriesList.push(seriesData)
                    }
                    let documentData = documentSnapshot.data()
                    documentData['id'] = documentSnapshot.id
                    data.push([documentData,seriesList])
                }             
                
                setData(data)
            })
        }
    },[])
 
    console.log('get static props')

    if(!data){
        return (
            <>Loading...</>
        )
    }

    return (
        <>
            <h1>Fetched Data</h1>
            <table>
                {data.map((datum) => {
                return <div className={styles.dropdown} key={datum.id}>
                    <button className={styles.dropbtn}>{datum[0].name}</button>
                    <div className={styles['dropdown-content']}>
                            {datum[1].map((series)=>{
                                return <Link href={`/pumps/${series.id}`} key={series.id}>{series.name}</Link>
                            })}
                        </div>
                    </div>
                })}
            </table>
        </>
    )
}

export default GetPumps