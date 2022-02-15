import { TextField } from '@mui/material';
import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from "@material-ui/core";
import Card from '@mui/material/Card';
import type {UpdateProf} from '../pages/Profiles/[pid]';

interface Values {
    firstName: string
    lastName: string
    headline: string
}

interface Props {
    onSubmit: (values: Values) => void;
}

{/* Form that opens up when editting header section */} 
const Headerform = ({onSubmit, profileData}: {onSubmit: (values: Values) => void, profileData: UpdateProf}) => {
    return (
        <Formik initialValues={{firstName: '', lastName: '', headline: ''}} onSubmit={(values) => {
            onSubmit(values);
        }}>
            
            {({values, handleChange, handleBlur}) => (
                <Card sx={{padding: 2, width: '250px', backgroundColor: 'white', border: 1, boxShadow: 12}}>
                    <Form>
                        <br />
                        <div>
                            <TextField label="First name" placeholder={profileData.firstName} name="firstName" value={values.firstName} 
                            onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <br />
                        <div>
                            <TextField label="Last name" placeholder={profileData.lastName} name="lastName" value={values.lastName} 
                            onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <br />
                        <div>
                            <TextField inputProps={{ maxLength: 50 }} label="Headline" placeholder={profileData.headline} name="headline" 
                            value={values.headline} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        
                        <Button type="submit"> Save Changes </Button>
                        
                    </Form>
                </Card>
            )}
        </Formik>
    )
};

export default Headerform;