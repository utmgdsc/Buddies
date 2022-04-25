import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box, Card, Container } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TablePagination from '@mui/material/TablePagination';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import { useEffect } from 'react';
import CardActionArea from '@mui/material/CardActionArea';
import MultipleSelectPlaceholder from '../components/Filter';
import { getPostings } from '../api';

type Project = {
  Title: string,
  ProjectId: number,
  Description: string,
  Location: string,
  Username: string,
  BuddyScore: number,
  MaxMembers: number,
  CurrentMembers: number,
  Category: string,
};

type FilterObject = {
  Location: string,
  Members: number,
  Category: string
};

// default filter values. Indicate, there are no filters to apply
let filterTracker: FilterObject = {
  Location: 'N/A',
  Members: -1,
  Category: 'N/A',
};

let memberfilters: string[] = [];
let locations: string[] = []; // all filters
let categories: string[] = [];
let page = 0;
//let totalProjects: number = 0;

/* Project postings page. Responsible for putting all the components that make up the
  page together. It also sends GET requests to get all project based on filtered
  values.
*/
const PostingsTable = () => {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalProjects, setTotalProjects] = React.useState(0);
  const [projects, setProjects] = React.useState<Project[]>([]);

  /* Gets project by id and then creates necessary global data structures.
     (memberLst, invitedLst, project object)
  */
  function getAndMakePostings() {
    let path: string = '';
    Object.keys(filterTracker).forEach((fil) => {
      if (filterTracker[fil as keyof FilterObject] === 'N/A') {
        path += 'null/'; // indicates there is no filter to apply
      } else if (filterTracker[fil as keyof FilterObject] === -1 || filterTracker[fil as keyof FilterObject] === '-1') {
        path += '-1/'; // indicates there is no filter to apply
      } else {
        path += `${filterTracker[fil as keyof FilterObject]}/`;
      }
    });

    getPostings(path, page + 1, rowsPerPage).then((res) => {
      const DATA: Project[] = [];
      for (let i = 0; i < res.data.projects.length; i += 1) {
        DATA[i] = {
          Title: res.data.projects[i].title,
          ProjectId: res.data.projects[i].projectId,
          Description: res.data.projects[i].description,
          Location: res.data.projects[i].location,
          Username: res.data.projects[i].username,
          BuddyScore: res.data.projects[i].buddyScore,
          MaxMembers: res.data.projects[i].maxMembers,
          CurrentMembers: res.data.projects[i].currentMembers,
          Category: res.data.projects[i].category,
        };
        locations = res.data.locations;
        memberfilters = res.data.members;
        categories = res.data.categories;
      }
      setTotalProjects(res.data.totalPages * rowsPerPage);
      setProjects(DATA);
    }).catch(() => {
      alert('Uh oh, something went wrong...');
    });
  }

  useEffect(() => {
    getAndMakePostings();
  }, []);

  const handleChangePage = (e: unknown, newPage: number) => {
    page = newPage;
    getAndMakePostings();
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    page = 0;
  };

  const applyFilter = (filterType: string, filterValue: string | number) => {
    /// applyFilter...
    filterTracker = { ...filterTracker, [filterType as keyof FilterObject]: filterValue };
    page = 0;
    getAndMakePostings();
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} style={{ marginTop: 20 }}>
          <Grid container>
            <Grid item xs={12} sm={12} md={4}>
              <Typography sx={{ marginTop: 4, marginLeft: 1 }} variant="h4">
                Recent Postings
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
              <MultipleSelectPlaceholder placeholder="Location" names={locations} filtFunc={applyFilter} />
              <MultipleSelectPlaceholder placeholder="Members" names={memberfilters} filtFunc={applyFilter} />
              <MultipleSelectPlaceholder placeholder="Category" names={categories} filtFunc={applyFilter} />
              <ListIcon sx={{ marginTop: 5, float: 'right' }} />
            </Grid>
          </Grid>
          <Box sx={{
            width: '100%', backgroundColor: 'black', height: 10, marginBottom: 5,
          }}
          />
          <TableContainer component={Paper} sx={{ width: '100%', marginleft: 5 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Projects</TableCell>
                  <TableCell>Members</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((row) => (
                  <TableRow
                    key={row.ProjectId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <CardActionArea href={`/projects/${row.ProjectId}`}>
                        <Grid container>
                          <Grid item>
                            <Typography variant="h5">
                              {row.Title}
                            </Typography>
                            <Grid container>
                              <Avatar />
                              <Typography sx={{ marginTop: 2, marginLeft: 1 }} variant="subtitle2">
                                {row.Username}

                              </Typography>
                              <Card
                                style={{
                                  color: 'white',
                                  backgroundColor: 'green',
                                  maxWidth: '30px',
                                  maxHeight: '25px',
                                  minWidth: '30px',
                                  minHeight: '25px',
                                  marginLeft: 20,
                                  marginTop: 8,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  display: 'flex',
                                }}
                              >
                                {row.BuddyScore}
                              </Card>
                              <LocationOnIcon sx={{ marginTop: 1.35, marginLeft: 2 }} />
                              <Typography sx={{ marginTop: 2 }} variant="subtitle2">
                                {row.Location}
                              </Typography>
                              <DashboardIcon sx={{ marginTop: 1.5, marginLeft: 2 }} />
                              <Typography sx={{ marginTop: 2 }} variant="subtitle2">
                                {row.Category}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardActionArea>
                    </TableCell>
                    <TableCell>
                      <Grid container>
                        <PeopleAltIcon sx={{ marginTop: 1, marginRight: 2 }} />
                        <Typography sx={{ marginTop: 1 }} variant="subtitle2">
                          {row.CurrentMembers}
                          /
                          {row.MaxMembers}
                        </Typography>
                      </Grid>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={totalProjects}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />

            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostingsTable;
export type { Project };
