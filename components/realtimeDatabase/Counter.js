import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import {useState,useEffect} from 'react'

const Counter = ({id}) => {
    console.log('counter start')
    console.log(id)
    const [count,setCount] = useState('')

    useEffect(()=>{
        const onCountIncrease = (count) => setCount(count.val())

        const fetchData = async () => {
            firebase.database().ref('counts').child(id).on('value',onCountIncrease)
        }

        fetchData()

        return () => {
            firebase.database().ref('counts').child(id).off('value',onCountIncrease)
        }
    },[id])

    const increaseCount = async () => {
        console.log('start fetching')
        const registerCount = () => fetch('/api/incrementCount?id=' + encodeURIComponent(id))
        console.log('fetching...')
        registerCount()
        console.log('fetch finish')
    }

    return (
        <button onClick={increaseCount}>Increate Count {count ? count : '---'}</button>
    )
}

export default Counter