import React from 'react'
import JobItem from './JobItem'
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';

function giveHeadings(props)
{
  return (
    props.map(item=>{
       return <TableCell align="right">{item}</TableCell>
    })
  )
}

const JobList = (props) => {
  var headings=["Title","Deadline","Type","Salary","Duration","Skills Required","Posted By","Rating","Status"];
  var text1="Search By Title"
  var val1=props.inputValue;
  return(
 <> 

   <label htmlFor="search">{text1} </label>
   <input type="text" value ={val1}  onChange={props.jobFilterOnChange}/>
     <div>
      <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {giveHeadings(headings)}
          </TableRow>
        </TableHead>
        <TableBody>
        {
           props.jobs.map(job => {
            var id=job._id;
            var email=props.email;
            var user=props.user; 
           return <JobItem job={job} key={id} email={email} user={user}/>
           })
        }
        </TableBody>
      </Table>
    </TableContainer>
     </div>
  </>
    )
   }


export default JobList