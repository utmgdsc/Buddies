import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import { Box, Button, InputLabel } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StyleIcon from '@mui/icons-material/Style';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import { Container, FormControl } from '@material-ui/core';
import ListIcon from '@mui/icons-material/List';
import MultipleSelectPlaceholder from '../components/Filter';
import axios from 'axios';
import { useEffect } from 'react';

type Project = {
    Title: string,
    Description: string,
    Location: string,
    Username: string,
    BuddyScore: number,
    Members: number
    Category: string,
};

type FilterObject = {
    Location: string,
    Members: number,
    Category: string
};

let filterTracker: FilterObject = {
    Location: "N/A",
    Members: -1,
    Category: "N/A"
};

const api = axios.create({
    baseURL: '/api/v1/projects/postings/',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  });

let memberfilters: Set<string> = new Set();
memberfilters.add("Members: -1")

let locations: Set<string> = new Set();
locations.add("Location: N/A")

let categories: Set<string> = new Set();
categories.add("Category: N/A")

const PostingsTable = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [projects, setProjects] = React.useState<Project[]>([])
    
    function getPostings() {
        let path: string = "";
        for (const fil in filterTracker) {
            if (filterTracker[fil as keyof FilterObject] === "N/A") {
                path += "null" + "/"; //indicates there is no filter to apply
            } else if (filterTracker[fil as keyof FilterObject] === -1 || filterTracker[fil as keyof FilterObject] === "-1") {
                path += "-1" + "/"; //indicates there is no filter to apply
            }
            else {
                path += filterTracker[fil as keyof FilterObject] + "/";
            }
        }
        api.get(path).then((res) => {
            console.log(res.data.projects)
            let DATA: Project[] = []; 
            for (let i=0; i<res.data.projects.length; i++){
                DATA[i] = {
                    Title: res.data.projects[i].title,
                    Description: res.data.projects[i].description,
                    Location: res.data.projects[i].location,
                    Username: res.data.projects[i].username,
                    BuddyScore: res.data.projects[i].buddyScore,
                    Members: res.data.projects[i].members,
                    Category: res.data.projects[i].category
                }
                locations.add("Location: " + res.data.projects[i].location)
                memberfilters.add("Members: " + res.data.projects[i].members)
                categories.add("Category: " + res.data.projects[i].category)
            };
            console.log("DATA");
            console.log(DATA);
            setProjects(DATA);
        }).catch((error) => {
            alert(error);
        });
    }

    useEffect(() => {
        getPostings();
        console.log(projects);
        
        
      }, []);
      
    const handleChangePage = (e: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const applyFilter = (filterType: string, filterValue: string | number) => {
        ///applyFilter...
        filterTracker = {...filterTracker, [filterType as keyof FilterObject]: filterValue};
        console.log(filterTracker);
        getPostings();
        // for (const fil in filterTracker) {
        //     if ((filterTracker[fil as keyof FilterObject] != "") && (filterTracker[fil as keyof FilterObject] != 0)) {
        //         newProjects = newProjects.filter((project) => project[fil as keyof Project] == filterTracker[fil as keyof FilterObject]);
        //     }
        // }

        //applyFilter("", filterValue);
        //console.log('filtertype: ' + filterType);
        //console.log('filterValue: ' + filterValue);
        //const newProjects = DATA.filter((project) => project[filterType as keyof Project] == filterValue);
        //console.log(newProjects);
        //setProjects(newProjects);
    };

    return (
        <Container>
            <Grid container>
                <Grid item xs={12} style={{marginTop: 20}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={4}>
                            <Typography sx={{marginTop: 4, marginLeft: 1 }} variant="h4">
                                Recent Postings
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <MultipleSelectPlaceholder placeholder='Location' names={Array.from(locations.values())} filtFunc={applyFilter}/>
                            <MultipleSelectPlaceholder placeholder='Members' names={Array.from(memberfilters.values())} filtFunc={applyFilter}/>
                            <MultipleSelectPlaceholder placeholder='Category' names={Array.from(categories.values())} filtFunc={applyFilter}/>
                            <ListIcon sx={{marginTop: 5, float: 'right'}}/>
                        </Grid>
                    </Grid>
                    <Box sx={{width: '100%', backgroundColor: 'black', height: 10, marginBottom: 5}}/>            
                    <TableContainer component={Paper} sx={{width: '100%', marginleft: 5}}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Projects</TableCell>
                                <TableCell>Members</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow
                                key={row.Title}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Grid container>
                                            <Grid item>
                                                <Typography variant="h5">
                                                    {row.Title}
                                                </Typography>
                                                <Grid container>
                                                    <Avatar />
                                                    <Typography sx={{marginTop: 2, marginLeft: 1 }} variant="subtitle2">
                                                        {row.Username}

                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                        color: 'white',
                                                        backgroundColor: 'green',
                                                        maxWidth: '25px',
                                                        maxHeight: '25px',
                                                        minWidth: '25px',
                                                        minHeight: '25px',
                                                        marginLeft: 5,
                                                        marginTop: 10
                                                        }}
                                                    >
                                                        {row.BuddyScore}
                                                    </Button>
                                                    <LocationOnIcon sx={{marginTop: 1, marginLeft: 2}} />
                                                    <Typography sx={{marginTop: 2 }} variant="subtitle2">
                                                        {row.Location}
                                                    </Typography>
                                                    <StyleIcon sx={{marginTop: 1, marginLeft: 2}} />
                                                    <Typography sx={{marginTop: 2 }} variant="subtitle2">
                                                        {row.Category}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>
                                        <Grid container>
                                            <PeopleAltIcon sx={{marginTop: 1, marginRight: 2}} />
                                            <Typography sx={{marginTop: 1 }} variant="subtitle2">
                                                        {row.Members}/4
                                            </Typography>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            <TableFooter>
                                <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={projects.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            </TableFooter>
                            
                        </Table>
                    </TableContainer>
                </Grid>    
            </Grid>
        </Container>
    )
};

export default PostingsTable;
export type { Project };