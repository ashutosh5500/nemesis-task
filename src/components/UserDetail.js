import React, {useEffect, useState} from 'react';
import MaterialTable from "material-table";
import axios from "axios";

const UserDetail = () => {
    const [userData, setUserData] = useState([]);

    const columns = [
        {title: 'Name', field: "name"},
        {title: 'Username', field: "username"},
        {title: 'Email', field: "email"},
        {title: 'Phone', field: "phone"},
        {title: 'Website', field: "website"},
    ]

    const getUserList = () => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(res => {
                const users = res.data
                setUserData(users)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getUserList();
    }, [])

    const deleteUser = (e, rowData) => {
        const {id} = rowData;
        axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`, {method: 'DELETE'})
            .then(res => {
                let data = [...userData];
                const filteredData = data.filter(row => row.id !== id);
                setUserData(filteredData);
            })
            .catch(error => console.log(error))
    }




    return (
        <div>
            <MaterialTable title={"USER DETAIL TABLE"}
                           columns={columns}
                           data={userData}
                           editable={
                               {
                                   onRowAdd: (newRow) => new Promise((resolve, reject) => {
                                       axios.post('https://jsonplaceholder.typicode.com/users').then(() => {
                                           const addedRow = [...userData, newRow];
                                           setUserData(addedRow)
                                           resolve();
                                           console.log(addedRow)
                                       })

                                   }),
                                   onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                                       axios.post("https://jsonplaceholder.typicode.com/users")
                                           .then(() => {
                                               let update = [...userData]
                                               const updateRow = oldData.tableData.id
                                               update[updateRow] = newData
                                               setUserData([...update])
                                               resolve()
                                               console.log(update)
                                           })
                                   })
                               }


                           }
                           actions={[
                               {
                                   icon: 'add',
                                   tooltip: 'Add User',
                                   isFreeAction: true,
                                   onClick: (event) => alert("You want to add a new row")
                               },
                               {
                                   icon: 'delete',
                                   tooltip: 'Delete User',
                                   onClick: deleteUser

                               },
                           ]}


            />
        </div>
    );
};

export default UserDetail;