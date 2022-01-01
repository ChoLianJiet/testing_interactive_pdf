import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useRef,useState,useEffect } from 'react'
import useAuth from '../../firebase/useAuth'
import styles from '../../styles/Home.module.css'
import { table } from 'table';
import { useRouter } from 'next/router'
import { Document,Page,pdfjs } from 'react-pdf';
import DataTable from 'react-data-table-component';
import Link from 'next/link'
import Image from 'next/image'

function GetSinglePumpSeries ({context}) {
    console.log('context')
    console.log(context)
    const db = firebase.firestore()
    // const [query,setQuery] = useState(null)
    const [data,setData] = useState(null)
    const [selectedPartNumber,setSelectedPartNumber] = useState(null)
    const [editState,setEditState] = useState(false)
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const router = useRouter()
    console.log(router.query)

    useEffect(async ()=>{
        if(!data){
            let seriesQuery = await db.collectionGroup('series').where('id','==',router.query.slug).get()

            if(seriesQuery.docs.length > 0){
                // db.collection('pumps').onSnapshot( async function (query){
                    // console.log(query)
                    // setQuery(query)
                    let seriesSnapshot = seriesQuery.docs[0]
                    let seriesData = seriesSnapshot.data()
                    let partNumberList = []
                    let data = []

                    let partNumberQuery = await db.collection('pumps').doc(seriesData.brand.id).collection('series').doc(seriesSnapshot.id).collection('part_number').get()
                    for(let i = 0 ; i < partNumberQuery.docs.length;i++){
                        let partNumberSnapshot = partNumberQuery.docs[i]
                        let partNumberData = partNumberSnapshot.data()
                        partNumberData['id'] = partNumberSnapshot.id
                        partNumberList.push(partNumberData)
                    }
    
                    data.push([seriesData,partNumberList])           
                    
                    setData(data)
                    setSelectedPartNumber(partNumberList[0])
                    setEditState(false)
                // })
            } else {
                setData([])
            }
            // setQuery(seriesQuery)
        }
    },[])
 
    console.log('get static props')

    // function updateSelectedPartNumber(partNumber) {
    //     setSelectedPartNumber(partNumber)
    // }


    if(!data){
        return (
            <>Loading...</>
        )
    }
  
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  
    function onDocumentLoadSuccess({ numPages }){
      setNumPages(numPages)
    }
  
    function removeTextLayerOffset() {
      const textLayers = document.querySelectorAll(
        '.react-pdf__Page__textContent'
      )
      textLayers.forEach((layer)=>{
        const { style } = layer
        style.top = '0'
        style.left = '0'
        style.transform = ''
      })
    }

    return data.length == 0?
        <>Series does not exists</> :
        (
            <>
                <h1>Series</h1>
                {data.map((datum) => {
                    return <div className={styles.dropdown} key={datum.id}>
                        <button className={styles.dropbtn}>{datum[0].name}</button>
                        <div className={styles['dropdown-content']}>
                            {datum[1].map((partNumber)=>{
                                return <a key={partNumber.id} onClick={()=>{setSelectedPartNumber(partNumber)}}>{partNumber.name}</a>
                            })}
                        </div>
                    </div>
                })}
                <div>
                    <button onClick={()=>{setEditState(!editState)}}>{editState == true? 'Save' : 'Edit'}</button>
                </div>
                {selectedPartNumber? <>
                    <p>
                    <h1>Part No: {selectedPartNumber.name}</h1>
                    </p>
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{flex: "1", textAlign: 'center'}}>
                            {selectedPartNumber.images.length == 0? 
                                'No Data' : 
                                <table style={{'flex':'1'}} className={styles.specifications}>
                                    {selectedPartNumber.images[0].data.map((draggable,index)=>{
                                        return <tr style={{'height':'50px'}} key={draggable.image}>
                                            <td>
                                                <div style={{display:'flex',flexDirection: "row"}}>
                                                    <>{index + 1}) </>
                                                    <div style={{'flex': '1'}}>
                                                        <div key={draggable.id}>
                                                            <div>
                                                                <label htmlFor={`${draggable.id}_title`}>Title: </label>
                                                                <input id={`${draggable.id}_title`} type='text' placeholder='Title' readOnly defaultValue={draggable.data.title}/>
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`${draggable.id}_content`}>Content: </label>
                                                                <input id={`${draggable.id}_content`} type='text' placeholder='Content' readOnly defaultValue={draggable.data.content}/>
                                                            </div>
                                                            <div>X: {draggable.x}</div>
                                                            <div>Y: {draggable.y}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </table>
                            }
                        </div>
                        <div className={styles['add-image']} style={selectedPartNumber.images?{overflow: 'hidden', 'position': 'relative',}:{}} onClick={()=>{
                                // if(!selectedPartNumber.images){
                                //     console.log('clicked')
                                //     window.location.href='/add_images/' + selectedPartNumber.id;
                                // }
                            }} >
                            {selectedPartNumber.images.length != 0?
                                <div>
                                    <Image className={styles['add-image']} src={selectedPartNumber.images[0].image} style={{'object-fit':'contain'}}/> 
                                    {selectedPartNumber.images.length == 0? 
                                        <></> : 
                                        selectedPartNumber.images[0].data.map((draggable,index)=>{
                                            return <container key={draggable.image} style={{'top': draggable.y,'left': draggable.x,'cursor':'click','paddingTop': '5px','paddingBottom':'5px','paddingLeft':'10px','paddingRight':'10px','borderRadius': '20px','position':'absolute','color': 'green', 'backgroundColor': 'white', 'border': '1px solid black'}}>{index + 1}</container>
                                        })
                                    }
                                </div>
                                    :
                                <div style={{'text-align': 'center'}}>Add Image</div>}
                            {/* <Document file='https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf' onLoadSuccess={onDocumentLoadSuccess}>
                                <Page pageNumber={pageNumber} className={styles.parent_pdf} onLoadSuccess={removeTextLayerOffset}>
                                <div className={styles.child_pdf}>
                                <button onClick={()=>{
                                    if(pageNumber > 1){
                                    setPageNumber(pageNumber - 1)
                                    }
                                }} >Previous</button>
                                <p>Page {pageNumber} of {numPages}</p>
                                <button onClick={()=>{
                                    if(pageNumber < numPages){
                                    setPageNumber(pageNumber + 1)
                                    }
                                }} >Next</button>
                                </div>
                                </Page>
                            </Document> */}
                        </div>
                    </div>
                    <div>
                        <button onClick={()=>{
                            window.location.href='/add_images/' + selectedPartNumber.id;
                        }}>Edit Image</button>
                    </div>
                    <div>
                        <table className={styles.specifications}>
                            <tr>
                                <th>
                                    Title
                                </th>
                                <th>
                                    Value
                                </th>
                            </tr>
                            {data.map((datum) => {
                                let widget = []
                                console.log('haha')
                                console.log(datum)
                                let partNumber = datum[1].find((element) => element.id == selectedPartNumber.id)
                                for(var key in partNumber.specifications) {
                                    let keyList = key.split('_')
                                    for(let i = 0; i < keyList.length; i++) {
                                        keyList[i] = keyList[i][0].toUpperCase() + keyList[i].substring(1);
                                    }
                                    widget.push(<tr key={key}>
                                        <td>{keyList.join(' ')}</td>
                                        <td>
                                            {partNumber.specifications[key]}
                                        </td>
                                    </tr>)
                                }
                                return widget
                            })}
                        </table>
                    </div>
                </> : <></>}
            </>
        )
}

export default GetSinglePumpSeries