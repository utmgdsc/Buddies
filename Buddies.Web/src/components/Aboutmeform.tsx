import { TextField } from '@mui/material';
import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from "@material-ui/core";
import Box from '@mui/material/Box';
import type {UpdateProf} from '../pages/Profiles/[pid]';

interface Values {
    aboutme: string
}

interface Props {
    onSubmit: (values: Values) => void;
}

{/* Form that opens up when editting aboutme section */} 
const Aboutmeform = ({onSubmit, profileData}: {onSubmit: (values: Values) => void, profileData: UpdateProf}) => {
    return (
        <Formik initialValues={{aboutme: ''}} onSubmit={(values) => {
            onSubmit(values);
        }}>
            
            {({values, handleChange, handleBlur}) => (
                <Box p = {2} boxShadow={12} sx={{width: '500px', backgroundColor: 'white', border: 1}}>
                    <Form>
                        <br />
                        <div>
                            <TextField inputProps={{ maxLength: 250 }} fullWidth label="About me" placeholder={profileData.aboutMe}
                             name="aboutme" value={values.aboutme} onChange={handleChange} onBlur={handleBlur} required/>
                        </div>
                        <br />                        
                        <Button type="submit"> Save Changes </Button>
                        
                    </Form>
                </Box>
            )}
        </Formik>
    )
};

export default Aboutmeform;