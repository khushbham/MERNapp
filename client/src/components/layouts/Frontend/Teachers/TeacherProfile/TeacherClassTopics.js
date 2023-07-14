import React, { useEffect,useState } from 'react'
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import '../../../../../css/Frontend/style.css'

const TeacherClassTopics = (props) => {
    const {topics} = props
    // const dispatch = useDispatch()
    // const [selectfeilds ,setselectfeilds] = React.useState([])

    // useEffect(()=>{
    //     dispatch(getDropdownValues()).then((res)=>{
    //         setselectfeilds(res.data.filter((a) => {
    //             if (a.name == "topics") {
    //               return a;
    //             }
    //           })[0].options )
    //       })
    // },[])

    // var data=[]
    // const topicdata = 
    // topics?.map((index)=>{
    //     selectfeilds?.filter((value, id) => id == index &&  data.push(value))

    // })
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
                    {topics && topics.length && topics.map((topic,idx)=>{
                        return <Link className="TopicLinks mb-2" index={idx}>
                        {topic}
                       </Link>
                    })}
                    {/* {topics?.map((arr)=>{

                      return <Link href="#" className="TopicLinks mb-2">
                      {arr}
                     </Link>
                    })} */}
                
                {/* <Link href="#" className="TopicLinks mb-2">
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

export default TeacherClassTopics
