import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

function FilterByPageStatus() {
const [filterpage, setFilterPage] = React.useState('10');
const FilterPageChange = (event) => {
        setFilterPage(event.target.value);
};
    return (
        <>
            <FormControl>
                <InputLabel variant="standard" htmlFor="filter-by-page">
                    Filter by Content Status
                </InputLabel>
                <Select
                    value={filterpage}
                    defaultValue={10}
                    onChange={FilterPageChange}
                    displayEmpty
                    className="filtertype-pagestatus"
                >
                    <MenuItem value={10}>All Statuses</MenuItem>
                    <MenuItem value={20}>Published</MenuItem>
                    <MenuItem value={30}>Draft</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

export default FilterByPageStatus;