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
                  Class Name
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="type"
                  active={"type" === "type"}
                  direction="desc"
               >
                  Class Type
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="date"
                  active={"date" === "date"}
               >
                  Date and Time
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="session"
                  active={"session" === "session"}
               >
                  Session type
               </TableSortLabel>
            </TableCell>
            <TableCell>
               <TableSortLabel key="Status"
                  active={"Status" === "Status"}
               >
                  Session Status
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


