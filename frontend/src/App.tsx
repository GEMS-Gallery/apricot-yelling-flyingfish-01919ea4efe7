import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Book as BookIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const drawerWidth = 240;

interface Project {
  id: bigint;
  title: string;
  category: string;
  url: string;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const result = await backend.getProjects();
      setProjects(result);
      setFilteredProjects(result);
      const uniqueCategories = Array.from(new Set(result.map(p => p.category)));
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      const result = await backend.getProjectsByCategory(category);
      setFilteredProjects(result);
    }
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const result = await backend.searchProjects(query);
      setFilteredProjects(result);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            GEM's Showcase
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearch}
            />
          </Search>
          <Button color="inherit" startIcon={<AddIcon />}>
            Start Building
          </Button>
          <Button color="inherit" startIcon={<BookIcon />}>
            Learn
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {categories.map((category) => (
            <ListItem button key={category} onClick={() => handleCategoryFilter(category)}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '24px', marginTop: '64px' }}>
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={Number(project.id)}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://loremflickr.com/320/240/technology?lock=${Number(project.id)}`}
                  alt={project.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {project.title}
                  </Typography>
                  <Chip label={project.category} size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">Visit Website</a>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
}

export default App;
