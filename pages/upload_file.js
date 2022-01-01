import UploadImageWithData from "../components/storage/UploadImageWithData";
import firebase from 'firebase/compat/app'
import {withProtected} from '../firebase/routes'

const UploadFile = ({auth}) => {

    return (
        <>
            <UploadImageWithData auth={auth}/>
        </>
    )
}

export default withProtected(UploadFile)