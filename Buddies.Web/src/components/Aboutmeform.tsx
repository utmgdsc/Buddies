import TextField from '@mui/material/TextField';
import React from 'react';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import type { UpdateProf } from '../pages/profiles/[pid]';

interface Values {
  aboutme: string
}

/* Form that opens up when editting aboutme section */
const Aboutmeform = ({ onSubmit, profileData }: { onSubmit: (values: Values) => void,
  profileData: UpdateProf }) => {
  return (
    <Formik
      initialValues={{ aboutme: '' }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >

      {({ values, handleChange, handleBlur }) => (
        <Card sx={{
          width: '500px', border: 1, boxShadow: 12, padding: 2,
        }}
        >
          <Form>
            <br />
            <div>
              <TextField
                inputProps={{ maxLength: 250 }}
                fullWidth
                label="About me"
                placeholder={profileData.aboutMe}
                name="aboutme"
                value={values.aboutme}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <br />
            <Button type="submit"> Save Changes </Button>

          </Form>
        </Card>
      )}
    </Formik>
  );
};

export default Aboutmeform;
