import React from 'react';
import Box from '@mui/material/Box';
import { SkillResponse } from '../api/model/skillResponse';

/* Each individual skill */
const Skill = ({ skill, toggleSkill }: { skill: SkillResponse,
  toggleSkill: (id: number) => void }) => {
  function handleSkillClick() {
    toggleSkill(skill.id);
  }
  return (
    <div className="skills">
      <Box p={2} m={1} sx={{ border: 1, borderRadius: 8 }}>
        <input type="checkbox" checked={skill._delete} onChange={handleSkillClick} /> {/* eslint-disable-line */}
        {skill.name}
      </Box>
    </div>
  );
};

export default Skill;
