import { TextField } from '@mui/material';
import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from "@material-ui/core";
import Box from '@mui/material/Box';
import type {UpdateProf} from './Profile';

interface Values {
    name: string
    bio: string
}

interface Props {
    onSubmit: (values: Values) => void;
}

const Headerform = ({onSubmit, profileData}: {onSubmit: (values: Values) => void, profileData: UpdateProf}) => {
    return (
        <Formik initialValues={{name: '', bio: ''}} onSubmit={(values) => {
            onSubmit(values);
        }}>
            
            {({values, handleChange, handleBlur}) => (
                <Box p = {2} boxShadow={12} sx={{width: '250px', backgroundColor: 'white', border: 1}}>
                    <Form>
                        <br />
                        <div>
                            <TextField label="Name" placeholder={profileData.name} name="name" value={values.name} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <br />
                        <div>
                            <TextField label="Bio" placeholder={profileData.bio} name="bio" value={values.bio} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        
                        <Button type="submit"> Save Changes </Button>
                        
                    </Form>
                </Box>
            )}
        </Formik>
    )
};

export default Headerform;