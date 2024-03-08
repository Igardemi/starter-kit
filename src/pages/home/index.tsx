// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Spacecreator 2.0 🚀'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>All the best for your new project.</Typography>
            <Typography>
              SpaceCreator es unaplataforma de intranet diseñada para revolucionar la forma en que las organizaciones
              acceden a sus herramientas de trabajo diario y colaboran entre sí. Integra espacios de trabajo
              tridimensionales (3D) con una amplia gama de aplicaciones y recursos empresariales, SpaceCreator ofrece
              una experiencia única e inmersiva que va más allá de las tradicionales plataformas de intranet.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid item xs={12}>
        <Card>
          <CardHeader title='ACL and JWT 🔒'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              Access Control (ACL) and Authentication (JWT) are the two main security features of our template and are implemented in the starter-kit as well.
            </Typography>
            <Typography>Please read our Authentication and ACL Documentations to get more out of them.</Typography>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default Home
