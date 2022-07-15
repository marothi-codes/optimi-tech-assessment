import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import { Box } from '@mui/system';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

function LiveSearch() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/projects')
      .then((response) => response.json())
      .then((json) => setProjects(json.data));
  });

  return (
    <Stack sx={{ width: 300, margin: 'auto' }}>
      <Autocomplete
        id="project-search"
        getOptionLabel={(project) => `${project.name} ${project.group.name}`}
        options={projects}
        sx={{ width: 300 }}
        groupBy={(option) => option.name.toUpperCase()}
        isOptionEqualToValue={(option, value) => option.group.name === value.group.name}
        noOptionsText={'No projects with the specified name.'}
        renderInput={(params) => <TextField {...params} placeholder="Search for a project" />}
        renderOption={(props, project, { inputValue }) => {
          const stringsToMatch = `${project.name} ${project.group.name}`;
          const matches = match(
            stringsToMatch,
            inputValue,
            { insideWords: true },
            { findAllOccurrences: true },
          );
          const parts = parse(stringsToMatch, matches);

          return (
            <Box component="li" {...props} key={project.id}>
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

export default LiveSearch