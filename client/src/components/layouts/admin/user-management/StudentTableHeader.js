import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableSortLabel } from '@mui/material';

function UserTableHeader() {
   return (
      <TableHead>
         <TableRow>
            <TableCell>
               <TableSortLabel key="name"
                  active={"name" === "name"}
                  direction="asc"

               >
                  Name / Email
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="location"
                  active={"location" === "location"}
                  direction="desc"
               >
                  Location
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="type"
                  active={"type" === "type"}
               >
                  Type
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="status"
                  active={"status" === "status"}
               >
                  Status
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="action"
                  active={"action" === "action"}
               >
                  Action
               </TableSortLabel>
            </TableCell>
         </TableRow>

      </TableHead>
   );
}

export default UserTableHeader;