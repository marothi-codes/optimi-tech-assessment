import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/system';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

function LiveSearch() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async function getProjects() {
      const { data } = await axios.get('http://localhost:4000/api/projects');
      setProjects(data);
    })();
  }, []);

  // Material UI's Autocomplete component does not play well with the nested API data
  // as it is due to conflicting props, so I will tweak the array ever so slightly.
    const updatedProjects = projects.map(item => (
      item.groups.map(g => ({ ...g, project: item.name })) // Add the project name property as a group object property so that groups may be grouped by project in the Autocomplete component.
    ));

    // Extract the groups & concatenate them into one array for the component.
    const optionsList = [].concat(updatedProjects[0], updatedProjects[1]);

    const handleSearch = (e) => {
      const selectedGroup = optionsList.filter(x => x.name === e.target.value);
      const urlToRedirectTo = selectedGroup[0].url;
      window.open(urlToRedirectTo, '_blank');
      e.target.value = null;
    }

  return (
    <Stack sx={{ width: 270, margin: 'auto' }}>
      <Autocomplete
        id="nba-players"
        autoHighlight={true}
        groupBy={(group) => group.project}
        getOptionLabel={(group) => group.name}
        options={optionsList}
        sx={{ width: 270 }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText={'No groups with the specified name.'}
        renderInput={(params) => <TextField {...params} placeholder="Find a group." sx={{ backgroundColor: '#fff', borderRadius: '3.5px' }} />}
        onChange={(e) => handleSearch(e)}
        renderOption={(props, group, { inputValue }) => {
          const stringsToMatch = `${group.name}`;
          const matches = match(
            stringsToMatch,
            inputValue,
            { insideWords: true },
            { findAllOccurrences: true },
          );
          const parts = parse(stringsToMatch, matches);

          return (
            <Box component="li" {...props} key={group.id}>
              {parts.map((part, idx) => (
                <span key={idx} style={{ backgroundColor: part.highlight ? '#ffff00' : '' }}>
                  {part.text}
                </span>
              ))}
            </Box>
          );
        }}
      />
    </Stack>
  );
}

export default LiveSearch;
