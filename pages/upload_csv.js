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

export default UploadCSVPage

// export default withProtected(UploadCSVPage)