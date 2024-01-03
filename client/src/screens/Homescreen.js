import React, {useState, useEffect} from 'react'
import axios from "axios";
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';

const { RangePicker } = DatePicker;
function Homescreen() {

    const[rooms, setrooms] = useState([])
    const[loading, setloading] = useState()
    const[error, seterror] = useState()

    const[fromdate, setfromdate] = useState()
    const[todate, settodate] = useState()

    useEffect(() => {
	const fetchData = async() => {
 	   try {
            setloading(true)
            const response = await axios.get('/api/rooms/getallrooms');

            setrooms(response.data);
            setloading(false)

        } catch (error) {
            seterror(true)
            console.log(error)
            setloading(false)
        }
	};
        fetchData();
        
    }, [])

  function filterByDate(dates) 
  {
    setfromdate(moment(dates[0]).format('DD-MM-YYYY'))
    settodate(moment(dates[1]).format('DD-MM-YYYY'))
  }  

  return (
    <div className='coontainer'>

      <div className="row mt-5">
        <div className="col-md-3">
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate}/>
        </div>
      </div>

        <div className="row justify-content-center mt-5">
          {loading ? (
            <Loader/>
          ) : rooms.length>1 ? (
            rooms.map((room) => {

              return <div className="col-md-9 mt-2">
                <Room room={room} fromdate={fromdate} todate={todate}/>
              </div>;
    
              })
          ) : (
            <Error/>
          )}
        </div>
    </div>
  );
}

export default Homescreen;
