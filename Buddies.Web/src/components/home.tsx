import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// template: https://github.com/mui/material-ui/tree/v5.6.2/docs/data/material/getting-started/templates/album

const cards = [
  {
    id: 1,
    image: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
    title: 'Customize your Profile!',
    body: 'Let others know about your strengths and weaknesses! Describe what type of projects you like working on.',
    sourcetext: 'Male face vector created by studiogstock - www.freepik.com',
    source: 'https://www.freepik.com/vectors/male-face',
  },

  {
    id: 2,
    image: 'https://img.freepik.com/free-vector/top-10-best-podium-award_23-2148795639.jpg',
    title: 'Compete to be the best buddy!',
    body: 'Be the best buddy you can to grow your buddy score. Aim for the top spot on the leaderboard for bragging rights.',
    sourcetext: 'Top 10 vector created by freepik - www.freepik.com',
    source: 'https://www.freepik.com/vectors/top-10',
  },

  {
    id: 3,
    image: 'https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle-isolated-flat-vector-illustration-cartoon-partners-working-connection-teamwork-partnership-cooperation-concept_74855-9814.jpg',
    title: 'Create your own projects!',
    body: 'Create projects with custom requirements and get tailored buddy recommendations that match your project\'s needs!',
    sourcetext: 'Teamwork people vector created by pch.vector - www.freepik.com',
    source: 'https://www.freepik.com/vectors/teamwork-people',
  },

  {
    id: 4,
    image: 'https://img.freepik.com/free-vector/illustration-magnifying-glass_53876-28516.jpg',
    title: 'Search for Projects!',
    body: 'Search for projects via custom filters like category, location, and number of members.',
    sourcetext: 'Find icon vector created by rawpixel.com - www.freepik.com',
    source: 'https://www.freepik.com/vectors/find-icon',
  },

  {
    id: 5,
    image: 'https://img.freepik.com/free-vector/colleagues-working-together-project_74855-6308.jpg',
    title: 'Join Projects!',
    body: 'Found a project you like? Let the project owner know by requesting to join. Don\'t be shy!',
    sourcetext: 'Project team vector created by pch.vector - www.freepik.com',
    source: 'https://www.freepik.com/vectors/project-team',
  },

  {
    id: 6,
    image: 'https://img.freepik.com/free-vector/bulb-with-business-icons-flat-design_1212-121.jpg',
    title: 'Stay up to date!',
    body: 'Keep up to date with the latest activity on your projects with the notification system. Easily manage your invitations and join requests.',
    sourcetext: 'Company team vector created by photoroyalty - www.freepik.com',
    source: 'https://www.freepik.com/vectors/company-team',
  },
];

const Home = () => {
  return (
    <>
      <Box
        sx={{ mt: 8, mb: 6 }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h2"
            align="center"
            color="text.primary"
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
                    objectFit: 'contain',
                  }}
                  image={card.image}
                  alt="displayimg"
                />
                <Typography variant="subtitle2" align="center" color="text.secondary" style={{ fontSize: 10 }}>
                  <a href={card.source} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {' '}
                    {card.sourcetext}
                    {' '}
                  </a>
                </Typography>
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
};

export default Home;
