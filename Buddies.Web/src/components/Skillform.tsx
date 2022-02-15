import SkillList from './SkillList';
import { useRef, useState, useEffect } from 'react';
import type {UpdateProf, Skillobject} from '../pages/Profiles/[pid]';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/grid';
{/* Skill Form. Allows the user to update his skills*/}
function Skillform({submitFunc, profileData}: {submitFunc: VoidFunction, profileData: UpdateProf}) {
  const [skills, setSkills] = useState<Skillobject[]>([]);
  const skillNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSkills(profileData.skills);
  }, []);
  
  function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  function toggleSkill(id: number) {
    const newSkills = [...skills];
    const skill = newSkills.find(skill => skill.id === id);
    if (true && skill) {  //checks if skill is undefined
      skill.delete = !skill.delete;
      setSkills(newSkills);
    }
  };

  function handleAddSkill(e: React.ChangeEvent<any>) {
    
    const name = skillNameRef?.current?.value || '';
    if (name === '' ){
        return;
    } 

    setSkills([...skills, { "id": getRandomInt(0, 100000), "name": name, "delete": false}]);

    if (skillNameRef != null && skillNameRef.current != null && skillNameRef.current.value != null) { //to fix typescript errors
      skillNameRef.current.value = "";
    }
  };

  function handleClearSkills() {
    const newSkills = skills.filter(skill => !skill.delete);
    setSkills(newSkills);
  };


  function handleSave() {
    for (var i: number=0; i < skills.length; i++) {
      skills[i].id = i;
    }
    profileData.skills = skills;
    submitFunc();
  };
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
};

export default Skillform;
