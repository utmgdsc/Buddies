import {
  useRef, useState, useEffect, useCallback,
} from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import type { UpdateProf } from '../pages/profiles/[pid]';
import SkillList from './SkillList';
import { ProjectProfileResponse } from '../api/model/projectProfileResponse';
import { SkillResponse } from '../api/model/skillResponse';

/* Skill Form. Allows the user to update his skills */
const Skillform = ({ submitFunc, profileData, isProject }: { submitFunc: VoidFunction,
  profileData: UpdateProf | ProjectProfileResponse, isProject: boolean }) => {
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const skillNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSkills(profileData.skills);
  }, []);

  function getRandomInt(min: number, max: number): number {
    const minv: number = Math.ceil(min);
    const maxv: number = Math.floor(max);
    return Math.floor(Math.random() * (maxv - minv + 1)) + minv;
  }

  const toggleSkill = useCallback((id: number) => {
    const newSkills = [...skills];
    const skill = newSkills.find((skillCheck) => skillCheck.id === id);
    if (true && skill) { // checks if skill is undefined
      skill._delete = !skill._delete; // eslint-disable-line
      setSkills(newSkills);
    }
  }, [skills]);

  const handleAddSkill = useCallback(() => {
    const name = skillNameRef?.current?.value || '';
    if (name === '') {
      return;
    }

    setSkills([...skills, { id: getRandomInt(0, 100000), name, _delete: false }]);

    if (skillNameRef != null && skillNameRef.current != null
      && skillNameRef.current.value != null) { // to fix typescript errors
      skillNameRef.current.value = '';
    }
  }, [skills]);

  const handleClearSkills = useCallback(() => {
    const newSkills = skills.filter((skill) => !skill._delete); // eslint-disable-line
    setSkills(newSkills);
  }, [skills]);

  const handleSave = useCallback(() => {
    for (let i: number = 0; i < skills.length; i += 1) {
      skills[i].id = i;
    }
    profileData.skills = skills; // eslint-disable-line no-param-reassign
    submitFunc();
  }, [skills]);

  const canAdd: boolean = isProject ? (skills.length < 3) : true;
  return (
    <>
      <SkillList skills={skills} toggleSkill={toggleSkill} />
      <br />
      <input ref={skillNameRef} type="text" style={{ width: '100%', padding: 20, marginBottom: 3 }} />
      <br />
      <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
        {canAdd
        && (
        <Grid item>
          <Button variant="contained" onClick={handleAddSkill} style={{ backgroundColor: 'black', color: 'white' }}> Add Skill</Button>
        </Grid>
        )}
        <Grid item>
          <Button variant="contained" onClick={handleClearSkills} style={{ backgroundColor: 'black', color: 'white' }}>Clear Skills</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSave} style={{ backgroundColor: 'black', color: 'white' }}>Save</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Skillform;
