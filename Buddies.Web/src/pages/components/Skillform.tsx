import SkillList from './SkillList';
import { useRef, useState, useEffect } from 'react';
import type {UpdateProf, Skillobject} from './Profile';
import Button from '@material-ui/core/Button'
{/* Skill Form. Allows the user to update his skills*/}
function Skillform({submitFunc, profileData}: {submitFunc: VoidFunction, profileData: UpdateProf}) {
  const [skills, setSkills] = useState<Skillobject[]>([])
  const skillNameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setSkills(profileData.skills);
  }, [])
  
  function toggleSkill(id: number) {
    const newSkills = [...skills]
    const skill = newSkills.find(skill => skill.id === id)
    if (true && skill) {  //checks if skill is undefined
      skill.delete = !skill.delete
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
    const newSkills = skills.filter(skill => !skill.delete)
    setSkills(newSkills)
  }


  function handleSave() {
    profileData.skills = skills;
    console.log(profileData);
    submitFunc();
  }
  return (
    <>
      <SkillList skills={skills} toggleSkill={toggleSkill}/>
      <br></br>
      <input ref={skillNameRef} type="text"/>
      <Button variant="contained" onClick={handleAddSkill} style={{backgroundColor: "black", color: 'white'}}> Add Skill</Button>
      <Button variant="contained" onClick={handleClearSkills} style={{backgroundColor: "black", color: 'white'}}>Clear Skills</Button>
      <Button variant="contained" onClick={handleSave} style={{backgroundColor: "black", color: 'white'}}>Save</Button>
    </>
  );
}

export default Skillform;
