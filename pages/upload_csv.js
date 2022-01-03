import UploadCSV from "../components/cloudFirestore/UploadCSV";
import firebase from 'firebase/compat/app'
import {withProtected} from '../firebase/routes'

const UploadCSVPage = () => {

    return (
        <>
            <UploadCSV/>
        </>
    )
}

export default withProtected(UploadCSVPage)