import React, { useEffect } from "react";
import "../../../../css/Frontend/style.css";
import Container from "@mui/material/Container";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { GoSettings } from "react-icons/go";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import SearchData from "../Search/SearchData";
import { GrClose } from "react-icons/gr";
import SearchFiler from "../SearchFilter";
import { searchfilter } from "../../../../actions/frontent";
import { useDispatch } from "react-redux";
const closeBtnStyle = {
  position: "absolute",
  top: "20px",
  right: "18px",
  cursor: "pointer",
};
const filtercloseBtnStyle = {
  position: "absolute",
  top: "20px",
  right: "18px",
  cursor: "pointer",
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.8),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "100%",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  top: "0",
  left: "0",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 5),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));
const Modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "700px",
  bottom: "0",
  height: "100%",
  padding: "10px",
};

const SearchFilter = (props) => {
  const { setteacherData, page, settotalPages, keyword, setApiHit } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [filter, setFilter] = React.useState(false);
  const FilterOpen = () => setFilter(true);
  const filterClose = () => setFilter(false);

  const [Session, setVal] = React.useState("");
  const [inputValue, setInputValue] = React.useState(keyword && keyword);
  const [statevalue, setstatevalue] = React.useState("");
  const [session_type, setsession_type] = React.useState(0);
  const [private_or_group, setprivate_or_group] = React.useState("");
  const [class_level, setclass_level] = React.useState("");
  const [value, setValue] = React.useState(["15", "100"]);
  const [minimum_price, setminimum_price] = React.useState("");
  const [maximum_price, setmaximum_price] = React.useState("");
  console.log(inputValue);
  const search = () => {
    dispatch(
      searchfilter(
        inputValue,
        statevalue,
        Session,
        session_type,
        private_or_group,
        class_level,
        minimum_price,
        maximum_price,
        page
      )
    )
      .then((res) => {
        if (res && res.success) {
          setApiHit(true);
          setteacherData(res?.data?.records);
          settotalPages(res?.data?.totalRecords);
          setOpen(false);
          setFilter(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const oninputClick = () => {
    setInputValue("");
    initalEmptyValueSearch(1); // 1 for inputValue
  };
  const onstateClick = () => {
    setstatevalue("");
    initalEmptyValueSearch(2); // 2 for statevalue
  };
  const initalEmptyValueSearch = (data) => {
    dispatch(
      searchfilter(
        data == 1 ? "" : inputValue,
        data == 2 ? "" : statevalue,
        Session,
        session_type,
        private_or_group,
        class_level,
        minimum_price,
        maximum_price,
        1
      )
    )
      .then((res) => {
        setteacherData(res?.data?.records);
        settotalPages(res?.data?.totalRecords);
        setOpen(false);
        setFilter(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    search();
  }, [page]);

  return (
    <>
      <div className="SearchFilter">
        <Container>
          <FormControl variant="standard" className="w-100">
            <Search className="Search--Filter">
              <StyledInputBase
                className="w-100"
                placeholder="Search"
                onClick={handleOpen}
              ></StyledInputBase>
              <SearchIconWrapper>
                <FiSearch />
              </SearchIconWrapper>
              <div className="SearchSettings">
                <Button onClick={FilterOpen}>
                  {" "}
                  <GoSettings />
                </Button>
              </div>
            </Search>
            <div className="SearchResults d-flex mt-4">
              {inputValue && inputValue != "" && (
                <Button onClick={oninputClick} className="ResultsLink me-2">
                  {inputValue} <IoIosCloseCircleOutline />
                </Button>
              )}
              {statevalue && statevalue != "" && (
                <Button onClick={onstateClick} className="ResultsLink me-2">
                  {statevalue} <IoIosCloseCircleOutline />
                </Button>
              )}
            </div>
          </FormControl>
        </Container>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Modalstyle}>
          <SearchData
            setteacherData={setteacherData}
            setInputValue={setInputValue}
            setstatevalue={setstatevalue}
            inputValue={inputValue}
            statevalue={statevalue}
            Session={Session}
            setVal={setVal}
            search={search}
          />
          <Box className="closeIcon" sx={closeBtnStyle} onClick={handleClose}>
            <GrClose />
          </Box>
        </Box>
      </Modal>

      {/* for filter */}
      <Modal
        open={filter}
        onClose={filterClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Modalstyle}>
          <SearchFiler
            setsession_type={setsession_type}
            session_type={session_type}
            setprivate_or_group={setprivate_or_group}
            private_or_group={private_or_group}
            setclass_level={setclass_level}
            class_level={class_level}
            setValue={setValue}
            value={value}
            search={search}
            setminimum_price={setminimum_price}
            setmaximum_price={setmaximum_price}
            filterClose={filterClose}
          />
          <Box
            className="closeIcon"
            sx={filtercloseBtnStyle}
            onClick={filterClose}
          >
            <GrClose />
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default SearchFilter;
