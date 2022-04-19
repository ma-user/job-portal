import React from 'react'
import ApplicantItem from './ApplicantItem'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

var retall = "Return To All Jobs";
var applic = "Applications";

function Return()
{
    window.location.reload(true)
}

function giveRow(props)
{
  return (
    props.map(item=>{
        return <TableCell align="right">{item}</TableCell>
    })
  )
}

const ApplicantsList = (props) => {

  var rowEle = ["Name", "Skills", "Date of Application", "Statement of Purpose", "Rating", "Status"];
  return(
  <div>
    <Button color="secondary" onClick={Return}>{retall}</Button>
    <h3>{props.job.title} {applic}</h3>
      <TableContainer>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
          {giveRow(rowEle)}
          </TableRow>
        </TableHead>
        <TableBody>
        {
           props.users.map(user => {
             var jobb = props.job;
             var pdoa = props.doa;
             var id = user._id;
           return <ApplicantItem toggleDoUpdate={props.toggleDoUpdate} user={user} key={id} job={jobb} onClickAccept={props.onClickAccept} doa={pdoa} sop={props.sop}/>
           })
        }
        </TableBody>
      </Table>
    </TableContainer>
  </div>
    )
   
   }


export default ApplicantsList