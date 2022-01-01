import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useRef,useState } from 'react'

const UploadFile = () => {
    const inputEl = useRef(null)
    const [value,setValue] = useState(0)

    function uploadFile() {
        var file  = inputEl.current.files[0]
        var storageRef = firebase.storage().ref('user_uploads/' + file.name)
        var task = storageRef.put(file)

        task.on('state_change', 
            function progress(snapshot){
                setValue((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
            },
            function error(err){
                alert(error)
            },
            function complete(){
                alert('Uploaded to firebase storage successfully!')
            }
        )
    }

    return (
        <>
            <progress value={value} max="100"></progress>
            <input type="file" onChange={uploadFile} ref={inputEl}/>
        </>
    )
}

export default UploadFile