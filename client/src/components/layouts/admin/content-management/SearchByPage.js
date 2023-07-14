import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import { FiSearch } from "react-icons/fi";
import { FormControl } from "@mui/material";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.80),
  },
  marginTop: 20,
  height: 36,
  marginLeft: 0,
  width: '100%',
  border: 1,
  borderStyle: 'solid',
  borderColor: '#ced4da',
  [theme.breakpoints.up('sm')]: {
    // marginLeft: theme.spacing(3),
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  top: '0',
  right: '0',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 5, 1, 1),
    // vertical padding + font size from searchIcon
    // paddingRight: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
}));


function SearchByPage() {
  return (
    <>
      <FormControl variant="standard" className="page-search-field">
        <InputLabel shrink htmlFor="search">
          Search
        </InputLabel>
        <Search>
          <StyledInputBase
            placeholder="By page name"
            inputProps={{ 'aria-label': 'search' }}
          />
          <SearchIconWrapper className="srch-fltr">
            <FiSearch />
          </SearchIconWrapper>
        </Search>
      </FormControl>
    </>

  );
}


export default SearchByPage;