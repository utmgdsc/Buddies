import React from 'react';
import Box from '@mui/material/Box';
import type { Skillobject } from '../pages/profiles/[pid]';

/* Each individual skill */
const Skill = ({ skill, toggleSkill }: { skill: Skillobject,
  toggleSkill: (id: number) => void }) => {
  function handleSkillClick() {
    toggleSkill(skill.id);
  }
  return (
    <div className="skills">
      <Box p={2} m={1} sx={{ border: 1, borderRadius: 8 }}>
        <input type="checkbox" checked={skill.delete} onChange={handleSkillClick} />
        {skill.name}
      </Box>
    </div>
  );
};

export default Skill;
