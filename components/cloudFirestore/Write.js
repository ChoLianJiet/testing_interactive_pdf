import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import useAuth from '../../firebase/useAuth'

const WriteToCloudFirestore = () => {
    // const db = firebase.firestore();

    const {user} = useAuth()
    const db = firebase.firestore()

    const sendData = () => {
        try{
            //send data
            db.collection('my_collection').doc(user.id).set({
                string_data: 'John Wick',
                number_data: 2,
                boolean_data: true,
                map_data: {
                    string_in_map: 'Hi',
                    number_in_map: 7,
                },
                array_data: ['text', 4],
                null_data: null,
                time_stamp: firebase.firestore.Timestamp.fromDate(new Date('December 17, 1995 03:24:00')),
                geo_point: new firebase.firestore.GeoPoint(34.714322,-131.468435),
            })
            .then(alert('Data was successfully sent to cloud firestore!'))
        } catch (error){
            console.log(error)
            alert(error)
        }
    }

    return (
        <button onClick={sendData}>
            Send Data To Cloud Firestore
        </button>
    )
}

export default WriteToCloudFirestore