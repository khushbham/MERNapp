import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
}

export default Loader;
