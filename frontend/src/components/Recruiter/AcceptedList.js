import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import React from 'react'
import AcceptedItem from './AcceptedItem'
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function giveHeadings(props)
{
  return (
    props.map(item=>{
      var align="right"
      if(item=="Name")
        align="left"
       return <TableCell align={align}>{item}</TableCell>
    })
  )
}

function AcceptedList(props){
  return(
 <> 
     <div>
      <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            {giveHeadings(["Name","Title","Date of Joining","Job Type","Rating","Rating By You"])}
          </TableRow>
        </TableHead>
        <TableBody>
        {
           props.users.map(user => {
             var email=props.email;
             var id=user._id;
           return <AcceptedItem email={email} user={user} key={id} />
           })
        }
        </TableBody>
      </Table>
    </TableContainer>
     </div>
  </>
    )
   
   }


export default AcceptedList