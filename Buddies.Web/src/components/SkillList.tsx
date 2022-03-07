import React from 'react';
import Grid from '@material-ui/core/grid';
import Skill from './Skill';
import type { Skillobject } from '../pages/Profiles/[pid]';

/* returns a list of all the skills in a grid */

const SkillList = ({ skills, toggleSkill }: { skills: Skillobject[],
  toggleSkill: (id: number) => void }) => {
  return (
    <Grid container>
      {skills.map((skill) => {
        return <Skill key={skill.id} toggleSkill={toggleSkill} skill={skill} />;
      })}
    </Grid>
  );
};

export default SkillList;
