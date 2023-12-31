import React, {useState, useEffect} from 'react'
import axios from "axios";

function Homescreen() {

    const[rooms, setrooms] = useState([])
    useEffect(() => {
	const fetchData = async() => {
 	   try {
            const response = await axios.get('/api/rooms/getallrooms');
        setrooms(response.data);

        } catch (error) {
            console.log(error)
        }
	};
        fetchData();
        
    }, [])

  return (
    <div>
       <h1>Home Screen</h1>
       <h1>there are {rooms.length} rooms</h1>
    </div>
  )
}

export default Homescreen;
