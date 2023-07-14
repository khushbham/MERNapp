import React from 'react'
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import '../../../../css/Frontend/style.css'
const ClassTopics = (props) => {
    const {topics} = props
    return (
        <div className="TopicsWrap">
            <Typography variant="h4" gutterBottom component="h4" className="desc-heading my-3">Topics</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap'
                    }
                }
                >
                     {topics?.map((arr)=>{

                      return <Link href="#" className="TopicLinks mb-2">
                      {arr}
                     </Link>
                    })}
                {/* <Link href="#" className="TopicLinks mb-2">
                 Art
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Illustration
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Design
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Editorial
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Characters
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Urban Graffiti
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Portfolio
                </Link> */}
                </Box>
        </div>
    )
}

export default ClassTopics
