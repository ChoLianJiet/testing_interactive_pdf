import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import useAuth from '../../firebase/useAuth'

const ReadFromCloudFirestore = () => {

    const {user} = useAuth()
    const db = firebase.firestore()

    const readData = () => {
        try{
            //send data
            db.collection('my_collection').doc(user.id).onSnapshot( function (doc){
                console.log(doc.data())
            })
            alert('Data was successfully fetched from cloud firestore!')
        } catch (error){
            console.log(error)
            alert(error)
        }
    }

    return (
        <button onClick = {readData}>Read Data From Firestore</button>
    )
}

export default ReadFromCloudFirestore