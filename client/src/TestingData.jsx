import React, { useState } from 'react'

const TestingData = ({data : {users}}) => {


    const [searchName,setSearchName] = useState("");


    // console.log(data.users)


    // const findUser = data.users.find(user => user.name===searchName);

    const filteredUser = users.filter(user => user.name.toLowerCase().includes(searchName.toLowerCase()) );



  return (
    <div>
        <h1>Finding user Exact Match..</h1>

        {/* <input type="text"
        placeholder='Enter Name'
        value={searchName}
        onChange={(e)=>setSearchName(e.target.value)}
        
        /> */}
         
         {/* { findUser ? <p>{findUser.name}</p> : <p>User Not Found</p>} */}

      <input type="text"
        placeholder='Enter Name'
        key={users.id}
        value={searchName}
        onChange={(e)=>setSearchName(e.target.value)}
       />

       <ul>

        {
            filteredUser.map(u => (
                <li>
                    {u.name}
                </li>
            ))
        }
       </ul>

          
    </div>
  )
}

export default TestingData