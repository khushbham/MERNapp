import React from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const FeesDetails = ({price}) => {
    return (
        <div className="SessionDetails">
            <Grid container spacing={2}>
                <Grid item lg={8} xs={12}>
                <Typography variant="h4" gutterBottom component="h1" className="PriceDetail mb-0">
                   <span className="Price">${price}</span>/Session*
                </Typography>
                <Typography paragraph={true}>
                  *Rate is per student
                </Typography>
                </Grid>
                <Grid item lg={4} xs={12}>
                   {/* <Link href="#" className="contactBtn">contact teacher</Link> */}
                </Grid>
            </Grid>
        </div>
    )
}

export default FeesDetails
