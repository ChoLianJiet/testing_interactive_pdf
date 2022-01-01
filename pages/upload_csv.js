import UploadCSV from "../components/cloudFirestore/UploadCSV";
import firebase from 'firebase/compat/app'
import {withProtected} from '../firebase/routes'

const UploadCSVPage = ({auth}) => {

    return (
        <>
            <UploadCSV auth={auth}/>
        </>
    )
}

export default withProtected(UploadCSVPage)