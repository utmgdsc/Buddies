import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    },
  },
};


export default function MultipleSelectPlaceholder({ placeholder, names, filtFunc }:
   { placeholder: string, names: string[], filtFunc: (filterType: string, filterValue: any) => void}) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    //console.log('hi');
    //console.log(personName[0].slice(placeholder.length+2));
    //filtFunc(placeholder, personName);
  };

  React.useEffect(() => {
    if (personName.length != 0) {
      console.log('hi');
      const compare: string = personName[0].slice(placeholder.length+2);
      console.log(compare);
      filtFunc(placeholder, compare);
    }
  }, [personName]);

  return (
      <FormControl sx={{ m: 1, mt: 3, float: 'right'}}>
        <Select
          displayEmpty
          value={personName || ""}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{placeholder}</em>;
            }

            return selected.join(', ');
          }}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name.slice(placeholder.length+2) == -1?"Members: N/A" : name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}