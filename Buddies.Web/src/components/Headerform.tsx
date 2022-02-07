import { TextField } from '@mui/material';
import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from "@material-ui/core";
import Box from '@mui/material/Box';
import type {UpdateProf} from '../pages/Profiles/[pid]';

interface Values {
    firstName: string
    lastName: string
    headline: string
}

interface Props {
    onSubmit: (values: Values) => void;
}

const Headerform = ({onSubmit, profileData}: {onSubmit: (values: Values) => void, profileData: UpdateProf}) => {
    return (
        <Formik initialValues={{firstName: '', lastName: '', headline: ''}} onSubmit={(values) => {
            onSubmit(values);
        }}>
            
            {({values, handleChange, handleBlur}) => (
                <Box p = {2} boxShadow={12} sx={{width: '250px', backgroundColor: 'white', border: 1}}>
                    <Form>
                        <br />
                        <div>
                            <TextField label="First name" placeholder={profileData.FirstName} name="firstName" value={values.firstName} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <br />
                        <div>
                            <TextField label="Last name" placeholder={profileData.LastName} name="lastName" value={values.lastName} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <br />
                        <div>
                            <TextField label="Headline" placeholder={profileData.Headline} name="headline" value={values.headline} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        
                        <Button type="submit"> Save Changes </Button>
                        
                    </Form>
                </Box>
            )}
        </Formik>
    )
};

export default Headerform;