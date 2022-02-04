import { TextField } from '@mui/material';
import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from "@material-ui/core";
import Box from '@mui/material/Box';
import type {UpdateProf} from './Profile';

interface Values {
    aboutme: string
}

interface Props {
    onSubmit: (values: Values) => void;
}

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
                            <TextField fullWidth label="About me" placeholder={profileData.aboutme} name="aboutme" value={values.aboutme} onChange={handleChange} onBlur={handleBlur}/>
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