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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import { Container, FormControl } from '@material-ui/core';
import ListIcon from '@mui/icons-material/List';
import MultipleSelectPlaceholder from '../components/Filter';

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
    Location: "",
    Members: 0,
    Category: ""
};

let DATA: Project[] = []; //fake data
for (let i=0; i<14; i++){
    DATA[i] = {
        Title: 'MP3 to JPG Web App ' + i,
        Description: 'Description ' + i,
        Location: (i%2 == 0) ? ('2') : ('3'),
        Username: 'Jack ' + i,
        BuddyScore: i,
        Members: (i%4 == 0) ? (3) : (2),
        Category: (i%3 == 0) ? ('2') : ('3')
    }
};

const memberfilters: string[] = [
    'Members: 0',
    'Members: 2',
    'Members: 3',
    'Members: 4',
    'Members: 5',
    'Members: 6',
    'Members: 7',
    'Members: 8',
    'Members: 9',
    'Members: 10',
    'Members: 11',
  ];

  const locations: string[] = [
    'Location: ',
    'Location: 2',
    'Location: 3',
    'Location: 4',
    'Location: 5',
    'Location: 6',
    'Location: 7',
    'Location: 8',
    'Location: 9',
    'Location: 10',
    'Location: 11',
  ];

  const categories: string[] = [
    'Category: ',
    'Category: 2',
    'Category: 3',
    'Category: 4',
    'Category: 5',
    'Category: 6',
    'Category: 7',
    'Category: 8',
    'Category: 9',
    'Category: 10',
    'Category: 11',
  ];

const PostingsTable = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [projects, setProjects] = React.useState(DATA)
    
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
        let newProjects = DATA.slice();
        for (const fil in filterTracker) {
            if ((filterTracker[fil as keyof FilterObject] != "") && (filterTracker[fil as keyof FilterObject] != 0)) {
                newProjects = newProjects.filter((project) => project[fil as keyof Project] == filterTracker[fil as keyof FilterObject]);
            }
        }
        setProjects(newProjects);
        //applyFilter("", filterValue);
        console.log(filterTracker);
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
                        <Grid item xs={12} sm={12} md={7}>
                            <Typography sx={{marginTop: 4, marginLeft: 1 }} variant="h4">
                                Recent Postings
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <ListIcon sx={{marginTop: 5}} />
                            <MultipleSelectPlaceholder placeholder='Category' names={categories} filtFunc={applyFilter}/>
                            <MultipleSelectPlaceholder placeholder='Members' names={memberfilters} filtFunc={applyFilter}/>
                            <MultipleSelectPlaceholder placeholder='Location' names={locations} filtFunc={applyFilter}/>
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