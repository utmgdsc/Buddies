import React from "react";
import type {Skillobject} from '../pages/Profiles/[pid]';
import Box from '@mui/material/Box';

{/* Each individual skill */}
export default function Skill({ skill, toggleSkill }: {skill: Skillobject, toggleSkill: (id: number) => void}) {
    function handleSkillClick () {
        toggleSkill(skill.id);
    }
    return(
        <div className="skills">
            <Box p = {2} m = {1} sx={{border: 1, borderRadius: 8}} >
                <input type="checkbox" checked={skill.delete} onChange={handleSkillClick} />
                {skill.name}
            </Box>
        </div>
    );
};