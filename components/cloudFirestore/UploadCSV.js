import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useRef,useState } from 'react'
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';


// const UploadFile = () => {
//     const inputEl = useRef(null)
//     const [value,setValue] = useState(0)

//     function uploadFile() {
//         var file  = inputEl.current.files[0]
//         var storageRef = firebase.storage().ref('user_uploads/' + file.name)
//         var task = storageRef.put(file)

//         task.on('state_change', 
//             function progress(snapshot){
//                 setValue((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
//             },
//             function error(err){
//                 alert(error)
//             },
//             function complete(){
//                 alert('Uploaded to firebase storage successfully!')
//             }
//         )
//     }

//     return (
//         <>
//             <progress value={value} max="100"></progress>
//             <input type="file" onChange={uploadFile} ref={inputEl}/>
//         </>
//     )
// }

const UploadCSV = ({auth}) => {
    const {user} = auth
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [loading,setLoading] = useState(false)
    const [uploadSuccess,setUploadSuccess] = useState(false)
    const [uploadHasError,setUploadHasError] = useState(false)
    const [errorMessage,setErrorMessage] = useState('')
   
      // process CSV data
    const processData = dataString => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    
        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"')
                        d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
                        d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }
        
                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }
    
        // prepare columns list from headers
        const columns = headers.map(c => ({
            name: c,
            selector: c,
        }));
    
        setData(list);
        setColumns(columns);
        setLoading(false)
        setUploadSuccess(false)
        setUploadHasError(false)
        setErrorMessage('')
    }

    const handleFiles = e => {
        // console.log(files.base64)
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          /* Parse data */
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
          processData(data);
        };
        reader.readAsBinaryString(file);
    }

    async function handleUpload(){
        setLoading(true)
        // console.log('Columns')
        // for (let i = 0; i < columns.length; i++) {
        //     const column = columns[i];
        //     console.log(column)            
        // }      
        try{
            const db = firebase.firestore()
            console.log('Data')
            for (let i = 0; i < data.length; i++) {
                const datum = data[i]
                let { brand,series,part_number,model_name,link,features } = datum
                let specifications = {}
                for (var key in datum) {
                    if (key != 'brand' & key != 'part_number' && key != 'link' && key != 'features'){
                        specifications[key] = datum[key]
                    }
                }
    
                let brandQuery = await db.collection('pumps').where('name','==',brand).get()
                let brandExists = false
                let brandId
    
                if(brandQuery.docs.length > 0){
                    brandExists = true;
                }
    
                if(brandExists == false){
                    let brandReference = db.collection('pumps').doc();
                    brandId = brandReference.id
                    await brandReference.set({
                        id: brandId,
                        name: brand,
                        time_created: firebase.firestore.Timestamp.now(),
                        last_updated: firebase.firestore.Timestamp.now()
                    })
                } else {
                    brandId = brandQuery.docs[0].id;
                }
    
                let seriesQuery = await db.collection('pumps').doc(brandId).collection('series').where('name','==',series).get()
                let seriesExists = false
                let seriesId
    
                if(seriesQuery.docs.length > 0){
                    seriesExists = true;
                }
    
                if(seriesExists == false){
                    let seriesReference = db.collection('pumps').doc(brandId).collection('series').doc();
                    seriesId = seriesReference.id
                    await seriesReference.set({
                        id: seriesId,
                        brand:{
                            id: brandId,
                            name: brand,
                            reference: db.collection('pumps').doc(brandId),
                        },
                        index: i,
                        name: series,
                        time_created: firebase.firestore.Timestamp.now(),
                        last_updated: firebase.firestore.Timestamp.now()
                    })
                } else {
                    seriesId = seriesQuery.docs[0].id;
                }           
                
                let partNumberReference = db.collection('pumps').doc(brandId).collection('series').doc(seriesId).collection('part_number').doc();
    
                let toUploadData = {
                    id: partNumberReference.id,
                    brand: {
                        id: brandId,
                        name: brand,
                        reference: db.collection('pumps').doc(brandId),
                    },
                    series: {
                        id: seriesId,
                        name: series,
                        reference: db.collection('pumps').doc(brandId).collection('series').doc(seriesId),
                    },
                    name: part_number,
                    index: i,
                    time_created: firebase.firestore.Timestamp.now(),
                    last_updated: firebase.firestore.Timestamp.now(),
                    images: [],
                    model_name,
                    link,
                    features,
                    specifications,
                }
    
                await partNumberReference.set(toUploadData)
                console.log('to upload data')
                console.log(toUploadData)            
            }
            setUploadSuccess(true)
        } catch (e) {
            console.log('error')
            console.log(e)
            setUploadHasError(true)
            setErrorMessage(e.toString())
        }
        setLoading(false)
    }

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFiles}/>
            {uploadSuccess?
                <p>Upload Successful!</p> :
                    uploadHasError?
                        <p>{errorMessage}</p> :
                        <DataTable
                            pagination
                            highlightOnHover
                            columns={columns}
                            data={data}
                        />
            }
            {data.length == 0? 
                <></> :
                loading? 
                    <div className="loader"></div> :
                        uploadSuccess?
                            <></> :
                                uploadHasError?
                                <></> :
                                <button onClick={handleUpload}>
                                    Upload
                                </button>
            }
        </div>
    )
}

export default UploadCSV