import React, { useEffect,useState } from "react";
import faker from "faker";
import SmartDataTable from "react-smart-data-table";
import { FiEdit, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import "react-smart-data-table/dist/react-smart-data-table.css";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";

import { getPagesData } from "../../../../actions/contentManagement";

export default function PageListTable() {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    dispatch(getPagesData()).then((res) => {
      if (res && res.success) {
        var numResults = res.data.length;
        var testData = [];

        for (let i = 0; i < numResults; i++) {
          testData.push({
            _id: res.data[i]._id,
            pagetitle: res.data[i].setting_title,
            //pagestatus: faker.address.cityName(),
          });
        }
        setTableData(testData);
      }
    });
  }, []);

  const headers = {
    _id: {
      text: "ID",
      invisible: true,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    pagetitle: {
      text: "Page Title",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    // pagestatus: {
    //   text: 'Content Status',
    //   invisible: false,
    //   sortable: true,
    //   filterable: true,
    //   transform: (value, index, row) => {
    //     return (
    //       <>
    //         <p>{value}</p>
    //       </>
    //     )
    //   },
    // },
    action: {
      text: "Action",
      invisible: false,
      sortable: false,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-middle" }}>
              <Link to={`/pages-content/${row._id}`} className="edit-userbtn">
                <FiEdit />
              </Link>
              {/* <button className="delete-userbtn"><FiXCircle /></button> */}
            </Box>
          </>
        );
      },
    },
  };
  return (
    <SmartDataTable
      data={tableData}
      name="test-table"
      className="ui compact selectable table page-list-table"
      sortable
      headers={headers}
    />
  );
}
