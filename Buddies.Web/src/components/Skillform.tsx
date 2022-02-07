import SkillList from './SkillList';
import { useRef, useState, useEffect } from 'react';
import type {UpdateProf, Skillobject} from '../pages/Profiles/[pid]';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/grid';
{/* Skill Form. Allows the user to update his skills*/}
function Skillform({submitFunc, profileData}: {submitFunc: VoidFunction, profileData: UpdateProf}) {
  const [skills, setSkills] = useState<Skillobject[]>([])
  const skillNameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setSkills(profileData.Skills);
  }, [])
  
  function toggleSkill(id: number) {
    const newSkills = [...skills]
    const skill = newSkills.find(skill => skill.Id === id)
    if (true && skill) {  //checks if skill is undefined
      skill.Delete = !skill.Delete
      setSkills(newSkills)
    }
  }

  function handleAddSkill(e) {
    
    const name = skillNameRef?.current?.value
    if (name === '' ){
        return
    } 
    console.log(name)
    setSkills(prevSkills => {
      return [...prevSkills, { id: Math.random(), name: name, delete: false}]
    })
    skillNameRef.current.value = null
  }

  function handleClearSkills() {
    const newSkills = skills.filter(skill => !skill.Delete)
    setSkills(newSkills)
  }


  function handleSave() {
    profileData.Skills = skills;
    console.log(profileData);
    submitFunc();
  }
  return (
    <>
      <SkillList skills={skills} toggleSkill={toggleSkill}/>
      <br/>
      <input ref={skillNameRef} type="text" style={{width: "100%", padding: 20, marginBottom: 3}}/>
      <br/>
      <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
        <Grid item>
          <Button variant="contained" onClick={handleAddSkill} style={{backgroundColor: "black", color: 'white'}}> Add Skill</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleClearSkills} style={{backgroundColor: "black", color: 'white'}}>Clear Skills</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSave} style={{backgroundColor: "black", color: 'white'}}>Save</Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Skillform;
