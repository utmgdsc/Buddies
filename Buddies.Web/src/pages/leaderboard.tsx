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
import { Box, Button, Container } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import TablePagination from '@mui/material/TablePagination';
import { useEffect } from 'react';
import CardActionArea from '@mui/material/CardActionArea';
import { getLeaderboard, getPostings } from '../api';

type User = {
    firstName: string,
    lastName: string,
    email: string,
    userId: number,
    buddyScore: number
}


let totalUsers: number = 0;

/* Leaderboard page. Responsible for putting all the components that make up the
  page together. It also sends GET requests to get all the users with the top
  buddy score
*/
const Leaderboard = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [leaderboard, setLeaderboard] = React.useState<User[]>([]);

  /* Gets leaderboard info and then
     creates necessary global vars  and states.
  */
  function getAndMakeLeaderboard() {

    getLeaderboard(page + 1, rowsPerPage).then((res) => {
      
      totalUsers = res.data.totalPages * rowsPerPage;
      setLeaderboard(res.data.users);
    }).catch((error) => {
      alert(error);
    });
  }

  useEffect(() => {
    getAndMakeLeaderboard();
  }, [page]);

  const handleChangePage = (e: unknown, newPage: number) => {
    console.log(newPage);
    setPage(newPage);
    getAndMakeLeaderboard();
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} style={{ marginTop: 20 }}>
          <Grid container>
            <Grid item xs={12} sm={12} md={4}>
              <Typography sx={{ marginTop: 4, marginLeft: 1 }} variant="h4">
                Leaderboard
              </Typography>
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
                  <TableCell>Buddies</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Buddy Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((row, index) => (
                  <TableRow
                    key={row.userId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <CardActionArea href={`/Profiles/${row.userId}`}>
                        <Grid container>
                          <Grid item>
                           
                            <Grid container>
                            <Typography sx={{ marginTop: 2, marginLeft: 1 }} variant="subtitle2">
                                {((page) * 5)+index + 1}. 

                              </Typography>
                              <Avatar />
                              <Typography sx={{ marginTop: 2, marginLeft: 1 }} variant="subtitle2">
                                {row.firstName + " " + row.lastName} 

                              </Typography>
                              
                              
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardActionArea>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <Grid container>
                          <Grid item>
                           
                            <Grid container>
                              
                              
                              <EmailIcon sx={{ marginTop: 1.35 }} />
                              <Typography sx={{ marginTop: 1.85 }} variant="subtitle2">
                                {row.email}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                    </TableCell>
                    <TableCell>
                      <Grid container>
                        
                        
                        <Button
                          disabled
                          variant="contained"
                          style={{
                            color: 'white',
                            backgroundColor: 'green',
                            maxWidth: '25px',
                            maxHeight: '25px',
                            minWidth: '25px',
                            minHeight: '25px',
                            marginLeft: 25,
                            marginTop: 8,
                          }}
                        >
                                {row.buddyScore}
                        </Button>
                       
                      </Grid>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={totalUsers}
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

export default Leaderboard;
