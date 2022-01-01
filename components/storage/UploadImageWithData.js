import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { useRef,useState,useEffect } from 'react'
import styles from '../../styles/Home.module.css'
import {useAuth} from '../../firebase/useAuth'

const UploadImageWithData = ({auth}) => {
    const {user} = auth
    const inputEl = useRef(null)
    const [value,setValue] = useState(0)
    const [file,setFile] = useState()
    const db = firebase.firestore()

    // var file;

    // useEffect(()=>{
    //     if(file){
    //         setFile(file)
    //     }
    // },[])

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        const file = e.target.files[0]
        
        setFile(file)   
    }

    function uploadFile() {
        if(!file){
            alert('Pleaase select a file to upload')
            return
        }
        // var file  = inputEl.current.files[0]
        var storageRef = firebase.storage().ref('images_files/' + file.name)
        var task = storageRef.put(file)

        task.on('state_change', 
            function progress(snapshot){
                setValue((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
                console.log(value)
            },
            function error(err){
                alert(error)
            },
            async function complete() {
                const fileUrl = await storageRef.getDownloadURL()
                // const id = user.id
                // const name = user.name
                // const email = user.email
                // console.log(id)
                db.collection('my_images').doc().set({
                    creator: user,
                    image_url: fileUrl,
                    time_created: firebase.firestore.Timestamp.fromDate(new Date()),
                    filename: file.name,
                })
                alert('Uploaded to firebase storage successfully!')

                
                // setFile()
            }
        )

        
    }

    return (    
        <>
            <container className={styles.main}>
                <label>Image Name</label> <input type="text" id="namebox" value={file == null? '' : file.name} disabled/>
                <br></br>
                <input type="file" accept="image/png, image/gif, image/jpeg" onChange={handleFileChange} ref={inputEl}/>
                <br></br>
                <img className={styles.img} src={file == null ? null : URL.createObjectURL(file)}/><label id="upprogress"></label> 
                <br></br>
                
                <br></br>
                {/* <button id="selbtn" onClick={handleFileChange} ref={inputEl}>Select Image</button> */}
                <button id="upbtn" onClick={uploadFile}>Upload Image</button>
                {/* <button id="downbtn">Retrieve Image</button> */}
                <br></br>
                <progress value={value} max="100"></progress>
                {/* <input type="file" accept="image/png, image/gif, image/jpeg" onChange={uploadFile} ref={inputEl}/> */}
            </container>
        </>
    )
}

export default UploadImageWithData