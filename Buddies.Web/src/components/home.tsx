import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// template: https://github.com/mui/material-ui/tree/v5.6.2/docs/data/material/getting-started/templates/album

const cards = [
    {id: 1,
    image: 'https://m.media-amazon.com/images/I/41jLBhDISxL._SY355_.jpg',
    title: 'Customize your Profile!',
    body: 'Let others know about your strengths and weaknesses! Describe what type of projects you like working on.'},

    {id: 2,
    image: 'https://aem.dropbox.com/cms/content/dam/dropbox/blog/files/2015/10/campus-cup-leaderboard.png',
    title: 'Compete to be the best buddy!',
    body: 'Be the best buddy you can to grow your buddy score. Aim for the top spot on the leaderboard for bragging rights'},

    {id: 3,
    image: 'https://www.insidehighered.com/sites/default/server_files/media/GettyImages-1208313447.jpg',
    title: 'Create your own projects!',
    body: 'Create projects with custom requirements and get tailored buddy recommendations that match your project needs!'},

    {id: 4,
    image: 'https://crmgamified.com/wp-content/uploads/2020/09/Sales-Management-drawing-01-e1602347137275.png',
    title: 'Search for Projects',
    body: 'Search for projects via custom filters like category, location, number of members.'},

    {id: 5,
    image: 'https://activeloc.com/wp-content/uploads/2021/01/istockphoto-1070519266-612x612-1.jpg',
    title: 'Join Projects!',
    body: 'Found a project you like? Let the project owner know by requesting to join. Don\'t be shy!'},

    {id: 6,
    image: 'https://png.pngtree.com/element_our/20190602/ourlarge/pngtree-team-staff-and-light-bulb-illustration-image_1385479.jpg',
    title: 'Stay up to date!',
    body: 'Keep up to date with the latest activity on your projects with the notification system. Easily manage you\'re invitations and join requests.'}
];

const Home = () => {
    return (
        <>
        <Box
          sx={{mt: 8, mb: 6}}
        >
            <Container maxWidth="sm">
                <Typography variant="h2"
                align="center" color="text.primary"
                gutterBottom
                >
                Project Buddies
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    Grow your portfolio and learn new skills as you connect 
                    with like minded buddies to work on exciting new
                    projects!
                </Typography>
                
            </Container>
            </Box>
            <Container sx={{ marginBottom: 8 }} maxWidth="md">
            <Grid container spacing={10}>
            {cards.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                    <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                    <CardMedia
                        component="img"
                        sx={{
                        // 16:9
                        pt: '56.25%',
                        maxHeight: 300,
                        objectFit: 'contain'
                        }}
                        image= {card.image}
                        alt="displayimg"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                        {card.title}
                        </Typography>
                        <Typography>
                        {card.body}
                        </Typography>
                    </CardContent>
                    </Card>
                    </Grid>
                    ))}
            </Grid>
            </Container>
        </>
    );
}

export default Home;