import { useState } from 'react'
import axios from "axios"
import * as XLSX from "xlsx"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [msg,setmsg] = useState("")
  const [status,setstatus] = useState(false)
  const[emaillist,setemail] = useState([])

  function handlemsg(evt)
  {
    setmsg(evt.target.value)
  }

  function handlefile(event)
  {
    const  file =event.target.files[0]

    const reader= new FileReader()

    reader.onload = function(event){
       const data = event.target.result
       const workbook = XLSX.read(data, {type:'binary'})
       const sheetname = workbook.SheetNames[0]
       const worksheet = workbook.Sheets[sheetname]
       const emaillist = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
       const totalemail = emaillist.map(function(item){return item.A})
       setemail(totalemail)
       console.log(totalemail)
    }

    reader.readAsBinaryString(file);
  }

  function send()
  {
    setstatus(true)
    axios.post("http://localhost:5000/sendmail",{msg:msg,emaillist:emaillist})
    .then(function(data)
    {
       if(data.data === true)
        { alert("Email Sent Successfully")
          setstatus(false)
        }
       
       else
       {   alert("Failed")}
    })
  }

  return (
    <>
      <div className=''>
       <h1> BulkMail</h1>
      </div>
      <div>
        <p>We can help your business with sending multiple email at once</p>
      </div>
      <div>
        <h2>Drag and Drop</h2>
      </div>
      <div className='text-black  '>
        <textarea onChange={handlemsg} value={msg} className='w-[80%] h-32 py-2 outline-none px-2 border-black rounded text-3xl'placeholder='Enter the email text...'></textarea>
      </div>
     <div>
      <input onChange={handlefile} type='file' className=''></input>
     </div>
     <p>Total Emails in the file :{emaillist.length}</p>
     <button onClick={send} className='bg-black-750 text-white rounded-md w-fit '>{status?"Sending..":"Send"}</button>
    </>
  )
}

export default App
