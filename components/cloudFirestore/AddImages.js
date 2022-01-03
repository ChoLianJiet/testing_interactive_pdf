import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useRef,useState,useEffect } from 'react'
import styles from '../../styles/Home.module.css'
import { table } from 'table';
import { useRouter } from 'next/router'
import { Document,Page,pdfjs } from 'react-pdf';
import DataTable from 'react-data-table-component';
import Draggable from 'react-draggable'
import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'
// import Draggable from 'draggable';

let allowAddDraggables = true

function AddImages () {
    const db = firebase.firestore()
    // const [query,setQuery] = useState(null)
    const [dataSnapshot,setDataSnapshot] = useState(null)
    const [images,setImages] = useState([])
    const [imageIndex,setImageIndex] = useState(0)
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    // const [draggables,setDraggables] = useState([])
    const [loading,setLoading] = useState(false)
    const [uploadSuccess,setUploadSuccess] = useState(false)
    const [uploadHasError,setUploadHasError] = useState(false)
    const [errorMessage,setErrorMessage] = useState('')
    const router = useRouter()
    // console.log(router.query)

    useEffect(async ()=>{
        if(!dataSnapshot){
            let partNumberQuery = await db.collectionGroup('part_number').where('id','==',router.query.slug).get()

            if(partNumberQuery.docs.length > 0){
                // db.collection('pumps').onSnapshot( async function (query){
                    // console.log(query)
                    // setQuery(query)
                    let partNumberSnapshot = partNumberQuery.docs[0]      
                    let imageList = []
                    for(let i = 0 ; i < partNumberSnapshot.data().images.length; i ++){
                        let image = partNumberSnapshot.data().images[i]
                        let data = []
                        for(let j = 0 ; j < image.data.length; j ++){
                            let draggable = image.data[j]
                            data.push({
                                data: draggable.data,
                                image: image.image,
                                id: draggable.id,
                                on_click: draggable.on_click,
                                redirect: draggable.redirect,
                                initialX: draggable.x,
                                initialY: draggable.y,
                                deltaX: 0,
                                deltaY: 0,
                                children: draggable.children
                            })
                        }
                        imageList.push({image: image.image,data})
                    }
                    setDataSnapshot(partNumberSnapshot)
                    setImages(imageList)
                    // setDraggables(list)
                // })
            } else {
                setImages([])
            }
            // setQuery(seriesQuery)
        }
    },[])

    // useEffect(() => {
    //     console.log('use effect draggables')
    // },[draggables])
 
    // console.log('get static props')

    // function updateSelectedPartNumber(partNumber) {
    //     setSelectedPartNumber(partNumber)
    // }


    if(!dataSnapshot){
        return (
            <>Loading...</>
        )
    }
  
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  
    const handleFileChange = (e) => {
        // console.log(e.target.files[0])
        const file = e.target.files[0]
        setImages([{image:file,data:[]}])   
        // setDraggables([])
    }

    function onDragStart(){
        allowAddDraggables = false
        // console.log('On start')
    }

    function onDrag(index,event,data){
        // console.log(event)
        // console.log(data)
        let list = []
        for(let i = 0;i < images.length;i++){
            let image = images[i]
            let data = []
            for(let j = 0 ; j < image.data.length;j++){
                let draggable = image.data[j]
                data.push(draggable)
            }
            list.push({image: image.image, data})
        }
        var snowballContainer = document.getElementById("snowballContainer");
        var snowballContainerLeft = (snowballContainer.offsetLeft)
        var snowballContainerTop = (snowballContainer.offsetTop)
        list[imageIndex].data[index].deltaX = data.x
        list[imageIndex].data[index].deltaY = data.y
        setImages(list)
        // console.log('client x: ' + event.clientX)
        // console.log('client y: ' + event.clientY)
        // console.log('left: ' + snowballContainerLeft)
        // console.log('top: ' + snowballContainerTop)
        // console.log(index +' On drag: ' + event)
        // console.log('offset X: ' + event.movementX)
        // console.log('offset Y: ' + event.movementY)
    }

    function onDragEnd(index,event,data){
        // console.log('drag end')
        // console.log(event)
        // console.log(data)
        // let list = []
        // for(let i = 0;i < images[imageIndex].data.length;i++){
        //     let draggable = images[imageIndex].data[i]
        //     list.push(draggable)
        // }
        // list[index].x = event.clientY
        // list[index].y = event.clientX
        // setDraggables(list)
        // console.log(index +' On drag: ' + event)
        // console.log('offset X: ' + event.movementX)
        // console.log('offset Y: ' + event.movementY)
        // setDraggables(list)
        allowAddDraggables = true
        // console.log('On stop')

    }

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
       }
       return result;
    }

    function createDraggable (event) {
        // console.log('event')
        // console.log(event)
        var snowballContainer = document.getElementById("snowballContainer");
        var snowball = document.getElementById("snowball");
        var snowballLeft = snowball.x - (snowballContainer.offsetLeft/4)
        var snowballTop = snowball.y - (snowballContainer.offsetTop/4)
        var x = event.pageX - snowballLeft - 15;
        var y = event.pageY - snowballTop - 15;
        let list = []
        for(let i = 0;i < images.length;i++){
            let image = images[i]
            let data = []
            for(let j = 0 ; j < image.data.length;j++){
                let draggable = image.data[j]
                data.push(draggable)
            }
            list.push({image: image.image, data})
        }
        // let list = []
        // for(let i = 0;i < images[imageIndex].data.length;i++){
        //     list.push(images[imageIndex].data[i])
        // }
        // console.log('Page X: ' + event.pageX)
        // console.log('Page Y: ' + event.pageY)
        // console.log('Container X: ' + snowballContainer.offsetLeft)
        // console.log('Container Y: ' + snowballContainer.offsetTop)
        // console.log('Image X: ' + snowballLeft)
        // console.log('Image Y: ' + snowballTop)
        // console.log('Click X: ' + x)
        // console.log('Click Y: ' + y)
        console.log('before list ' + list)
        let id = makeid(20)
        let title = id
        let content = id
        let remark = ''
        let on_click = ''
        let redirect = ''
        list[imageIndex].data.push({
            data:{
                title,
                content,
                remark,
            },
            image: list[imageIndex].image,
            id,
            on_click,
            redirect,
            initialX: x,
            initialY: y,
            deltaX: 0,
            deltaY: 0,
            children: []
        })
        // console.log('list pushed')
        setImages(list)
        // console.log('set draggables')
    }

    function removeDraggable(id) {
        let list = []
        for(let i = 0;i < images.length;i++){
            let image = images[i]
            let data = []
            for(let j = 0 ; j < image.data.length;j++){
                let draggable = image.data[j]
                if(draggable.id != id){
                    data.push(draggable)
                }
            }
            list.push({image: image.image, data})
        }
        setImages(list)
    }

    async function uploadImage(file) {
        let brandId = dataSnapshot.data().brand.id
        let seriesId = dataSnapshot.data().series.id
        let partNumberId = router.query.slug
        var storageRef = firebase.storage().ref('pumps/' + brandId + '/series/' + seriesId + '/part_number/' + partNumberId)
        console.log(file.type)
        console.log('type')
        let metadata = {
            contentType: file.type
        }
        var task = await storageRef.put(file,metadata)
        console.log(task)
        var fileUrl = await task.ref.getDownloadURL()
        console.log('file ref')
        console.log(fileUrl)

        return fileUrl

        // task.on('state_change', 
        //     function progress(snapshot){
        //         // setValue((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
        //     },
        //     function error(err){
        //         // alert(error)
        //     },
        //     function complete(){
        //         return fileUrl = await storageRef.getDownloadURL()
        //         // alert('Uploaded to firebase storage successfully!')
        //     }
        // )
    }

    async function handleSubmit(){
        if(images.length == 0){
            alert("Please select image");
            return
        }
        if(images[imageIndex].data.length == 0){
            alert('Add at least one data')
            return
        }
        setLoading(true) 
        try{
            const db = firebase.firestore()
            console.log('Data')
            let brandId = dataSnapshot.data().brand.id
            let seriesId = dataSnapshot.data().series.id
            let partNumberId = router.query.slug
            let partNumberReference = db.collection('pumps').doc(brandId).collection('series').doc(seriesId).collection('part_number').doc(partNumberId);
            let toUpdateImages = []
            for(let i = 0 ; i < images.length; i++){
                let image = images[i]
                let data = []
                for(let j = 0 ; j < image.data.length; j++){
                    let draggable = image.data[j]
                    data.push({
                        data: draggable.data,
                        id: draggable.id,
                        on_click: '',
                        redirect: '',
                        x: draggable.initialX + draggable.deltaX,
                        y: draggable.initialY + draggable.deltaY,
                        children: draggable.children
                    })
                }
                toUpdateImages.push({
                    image: image.image,
                    data
                })
            }
            console.log(toUpdateImages)
            for(let i = 0; i < toUpdateImages.length; i ++){
                if(typeof toUpdateImages[i].image != 'string'){
                    let imageUrl = await uploadImage(toUpdateImages[i].image)
                    toUpdateImages[i].image = imageUrl
                }
            }
            console.log(images)
            let toUpdateData = {
                images: toUpdateImages,
                last_updated: firebase.firestore.Timestamp.now(),
            }
            await partNumberReference.update(toUpdateData)
            // setImages(images)
            setUploadSuccess(true)
        } catch (e) {
            console.log('error')
            console.log(e)
            setUploadHasError(true)
            setErrorMessage(e.toString())
        }
        setLoading(false)
    }

    return dataSnapshot.exists == false?
        <>Part Number does not exists</> :
        (uploadSuccess?
            <p>Upload Successful!</p> :
                uploadHasError?
                    <p>{errorMessage}</p> :
            <div styles={{'flexDirection': 'column'}}>
                <h1>Part Number: {dataSnapshot.data().name}</h1>
                <div style={{display:'flex',flexDirection: "row"}}>
                    <a className={styles['add-image']} alt="snowballContainer" id="snowballContainer" style={images.length != 0?{overflow: 'hidden', 'position': 'relative', }:{'position': 'relative'}} onMouseDown={(event)=>{
                            // console.log('can drag: ' + allowAddDraggables)
                            if(images.length != 0 && allowAddDraggables == true){
                                console.log('create draggable')
                                createDraggable(event)
                            }
                        }}>
                        <div>
                            {images.length != 0?
                                <img className={styles['add-image']} src={typeof images[imageIndex].image == 'string'? images[imageIndex].image : URL.createObjectURL(images[imageIndex].image)} alt="snowball" id="snowball" style={{'object-fit':'contain'}}/> :
                                <div className={styles['add-image']} style={{'textAlign': 'center'}}>No Image</div>}
                            {images.length == 0? 
                                <></> : 
                                images[imageIndex].data.map((draggable,index)=>{
                                    return <Draggable id={draggable.id} key={draggable.id}  onStart={onDragStart} 
                                        onDrag={(event,data)=>{
                                            onDrag(index,event,data)
                                        }} onStop={(event,data)=>{
                                            onDragEnd(index,event,data)
                                        }}
                                    ><container style={{'top': draggable.initialY,'left': draggable.initialX,'cursor':'move','paddingTop': '5px','paddingBottom':'5px','paddingLeft':'10px','paddingRight':'10px','borderRadius': '20px','position':'absolute','color': 'green', 'backgroundColor': 'white', 'border': '1px solid black'}}>{index + 1}</container></Draggable>
                                })
                            }
                        </div>
                    </a>
                    {/* <Script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js' style={{flex:'1'}} onLoad={()=>{
                        return <Script src={jqueryNestables} onLoad={()=>{
                            return <div className={styles["cf nestable-lists"]} style={{flex:'1'}} >
                                <menu id="nestable-menu">
                                    <button type="button" data-action="expand-all">Expand All</button>
                                    <button type="button" data-action="collapse-all">Collapse All</button>
                                </menu>
                                <div className={styles["dd"]} id="nestable">
                                    <ol className={styles["dd-list"]}>
                                        <li className={styles["dd-item"]} data-id="1">
                                            <div className={styles["dd-handle"]}>Item 1</div>
                                        </li>
                                        <li className={styles["dd-item"]} data-id="2">
                                            <div className={styles["dd-handle"]}>Item 2</div>
                                            <ol className={styles["dd-list"]}>
                                                <li className={styles["dd-item"]} data-id="3"><div className={styles["dd-handle"]}>Item 3</div></li>
                                                <li className={styles["dd-item"]} data-id="4"><div className={styles["dd-handle"]}>Item 4</div></li>
                                                <li className={styles["dd-item"]} data-id="5">
                                                    <div className={styles["dd-handle"]}>Item 5</div>
                                                    <ol className={styles["dd-list"]}>
                                                        <li className={styles["dd-item"]} data-id="6"><div className={styles["dd-handle"]}>Item 6</div></li>
                                                        <li className={styles["dd-item"]} data-id="7"><div className={styles["dd-handle"]}>Item 7</div></li>
                                                        <li className={styles["dd-item"]} data-id="8"><div className={styles["dd-handle"]}>Item 8</div></li>
                                                    </ol>
                                                </li>
                                                <li className={styles["dd-item"]} data-id="9"><div className={styles["dd-handle"]}>Item 9</div></li>
                                                <li className={styles["dd-item"]} data-id="10"><div className={styles["dd-handle"]}>Item 10</div></li>
                                            </ol>
                                        </li>
                                        <li className={styles["dd-item"]} data-id="11">
                                            <div className={styles["dd-handle"]}>Item 11</div>
                                        </li>
                                        <li className={styles["dd-item"]} data-id="12">
                                            <div className={styles["dd-handle"]}>Item 12</div>
                                        </li>
                                    </ol>
                                </div>
                            </div>         
                        }}/>      
                    }}/> */}
                    {images.length == 0? 
                        <div style={{'flex':'1'}}>Select an image</div> : 
                        images[imageIndex].data.length == 0? 
                        <div style={{'flex':'1'}}>Click on Image to add data</div> : 
                        <table style={{'flex':'1'}} className={styles.specifications}>
                            {images[imageIndex].data.map((draggable,index)=>{
                                return <tr style={{'height':'50px'}} key={draggable.image}>
                                    <td>
                                        <div style={{display:'flex',flexDirection: "row"}}>
                                            <>{index + 1}) </>
                                            <div style={{'flex': '1'}}>
                                                <div key={draggable.id}>
                                                    <div>
                                                        <label htmlFor={`${draggable.id}_title`}>Title: </label>
                                                        <input id={`${draggable.id}_title`} type='text' placeholder='Title' onChange={(e)=>{
                                                            // onChangeTextInput(`${draggable.id}_title`)
                                                            let text = document.getElementById(`${draggable.id}_title`).value;
                                                            images[imageIndex].data.find(element => element.id == draggable.id).data.title = text
                                                        }} defaultValue={draggable.data.title}/>
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`${draggable.id}_content`}>Content: </label>
                                                        <input id={`${draggable.id}_content`} type='text' placeholder='Content' onChange={(e)=>{
                                                            // onChangeTextInput(`${draggable.id}_title`)
                                                            let text = document.getElementById(`${draggable.id}_content`).value;
                                                            images[imageIndex].data.find(element => element.id == draggable.id).data.content = text
                                                        }} defaultValue={draggable.data.content}/>
                                                    </div>
                                                    <div>X: {draggable.initialX + draggable.deltaX}</div>
                                                    <div>Y: {draggable.initialY + draggable.deltaY}</div>
                                                </div>
                                            </div>
                                            <button onClick={()=>{
                                                removeDraggable(draggable.id)
                                            }}>Remove</button>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </table>
                    }
                </div>
                <div>
                    <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange}/> 
                </div>
                <div>
                    {dataSnapshot.data().toString()}
                </div>
                <p></p>
                {loading? 
                    <></> :
                    <button onClick={handleSubmit}>
                        Upload
                    </button>
                }
            </div>
        )
}

export default AddImages