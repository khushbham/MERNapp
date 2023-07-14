import React from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import '../../../../css/admin/student.css'
const TablePagination = () => {
    return (
        <div className="PaginationWrap pb-5">
            <Stack spacing={2}>
                <Pagination count={5} color="primary" style={{ textAlign: 'center' }} />
            </Stack>
        </div>
    )
}
export default TablePagination
