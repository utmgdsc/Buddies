import React from "react";
import Skill from "./Skill"
import Grid from '@material-ui/core/grid';

{/* returns a list of all the skills in a grid*/}

export default function SkillList({ skills, toggleSkill }) {
    return(
        <Grid container > 
            {skills.map(skill => {
                return <Skill key={skill.id} toggleSkill={toggleSkill} skill={skill} />
            })}
        </ Grid> 
    )
}