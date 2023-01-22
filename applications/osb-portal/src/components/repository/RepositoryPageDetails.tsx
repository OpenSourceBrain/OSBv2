import * as React from "react";

//theme
import { styled } from "@mui/styles";
import {
  paragraph,
  secondaryColor as white,
  chipBg,
  bgRegular as lineColor,
  checkBoxColor as chipTextColor,
  bgInputs,
  repoPageContentBg,
  infoBoxBg,
  inputRadius,
  greyishTextColor,
  grey,
} from "../../theme";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemButton from "@mui/material/ListItemButton";

//icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

//types
import { OSBRepository } from "../../apiclient/workspaces";

const data = [
  {
    name: "FergusonEtAl2015.nwb",
    date: "6 months ago",
  },
  {
    name: "FergusonEtAl2015",
    date: "6 months ago",
  },
  {
    name: "FergusonEtAl201.nwb",
    date: "6 months ago",
  },
  {
    name: "FergusonEtAl2015.nw",
    date: "6 months ago",
  },
];

const RepoDetailsPageBox = styled(Box)(({ theme }) => ({
  background: repoPageContentBg,
  "& .MuiGrid-root>.MuiGrid-item": {
    padding: theme.spacing(4),
  },
  "& .MuiSvgIcon-root": {
    width: 16,
    height: 16,
  },
  "& .MuiTypography-h5": {
    fontWeight: 600,
  },
}));

const RepoDetailsIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    background: "transparent",
  },
  "& .MuiSvgIcon-root": {
    color: paragraph,
    width: 16,
    height: 16,
  },
}));

const RepoDetailsChip = styled(Chip)(({ theme }) => ({
  margin: 0,
  background: chipBg,
  color: chipTextColor,
}));

const RepoDetailsSearchField = styled(TextField)(({ theme }) => ({
  background: lineColor,
  borderRadius: "8px 0px 0px 8px",
  marginRight: "3px",
  flex: 1,
  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    borderRadius: "8px 0px 0px 8px",
    fontSize: "0.857rem",
  },
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    padding: "8px",
  },
  "& .MuiSvgIcon-root": {
    color: chipTextColor,
  },
}));

const RepoDetailsBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  color: bgInputs,
  "& .MuiTypography-root": {
    color: paragraph,
    fontSize: "0.857rem",
  },
}));

const RepoDetailsButton = styled(Button)(({ theme }) => ({
  background: lineColor,
  borderRadius: "0px 8px 8px 0px",
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  color: chipTextColor,
  fontSize: "0.857rem",
  boxShadow: "none",
}));

const AboutOSBBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  overflowY: "scroll",
  background: infoBoxBg,
  borderRadius: inputRadius,
  padding: "1rem",
  height: "25vh",
  "& .MuiTypography-root": {
    letterSpacing: "0.01em",
    color: greyishTextColor,
    fontSize: "1rem",
  },
}));

const RepoDetailsList = styled(List)(({ theme }) => ({
  "& .MuiListSubheader-root": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "transparent",
    "& .MuiTypography-root": {
      color: greyishTextColor,
      fontSize: "0.857rem",
    },
  },
}));

const RepoDetailsListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: "8px",
  "& .MuiListItemIcon-root": {
    color: grey,
    minWidth: "1.5rem",
  },
  "& .MuiTypography-root": {
    fontSize: "0.857rem",
  },
  "& .MuiListItemText-root": {
    color: grey,
    fontSize: "0.857rem",
  },
  "&.Mui-selected": {
    borderRadius: "8px",
  },
  "&:hover": {
    borderRadius: "8px",
  },
  "& .MuiSvgIcon-root": {
    "&:hover": {
      background: "transparent",
    },
  },
  "& .MuiCheckbox-root": {
    padding: "8px",
    "&:hover": {
      background: "transparent",
    },
  },
}));

const RepositoryPageDetails = ({
  repository,
}: {
  repository: OSBRepository;
}) => {
  const first = "alternative_jupyter_args";
  const second = "Tue Sep 06 2022";
  console.log({ repository });
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      OpenSourceBrain
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      NWBShowcase
    </Link>,
    <Typography key="3">FergusonEtAl2015</Typography>,
  ];

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <RepoDetailsPageBox className="verticalFit">
      <Grid container m={0}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box width={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width={1}
              borderBottom={`1px solid ${lineColor}`}
            >
              <Box display="flex" alignItems="center">
                <Typography variant="h5">Overview</Typography>
                <Tooltip
                  title={
                    <>
                      Repositories provide views of files in public resources
                      that have been indexed in OSBv2 by users. Use the
                      Repository Contents pane on the right to select files from
                      this repository to add to your workspaces.{" "}
                      <Link
                        href="https://docs.opensourcebrain.org/OSBv2/Repositories.html"
                        target="_blank"
                        underline="hover"
                      >
                        Learn more...
                      </Link>
                    </>
                  }
                >
                  <RepoDetailsIconButton>
                    <InfoOutlinedIcon />
                  </RepoDetailsIconButton>
                </Tooltip>
              </Box>
              <Button
                variant="text"
                endIcon={<ModeEditIcon />}
                sx={{ textTransform: "none", padding: 0 }}
              >
                Edit
              </Button>
            </Box>
            <Stack mt={3} mb={3} spacing={1}>
              <Typography variant="body2" sx={{ color: greyishTextColor }}>
                Context: {`${first}`}
              </Typography>
              <Typography variant="body2" sx={{ color: greyishTextColor }}>
                Created: {`${second}`}
              </Typography>
              <Stack direction="row" spacing={1}>
                <RepoDetailsChip
                  label="main"
                  icon={<LanOutlinedIcon sx={{ fill: paragraph }} />}
                />
                <RepoDetailsChip
                  label="Experimental Data"
                  icon={<CircleIcon className="greenStatusDot" />}
                />
                <RepoDetailsChip
                  label="Modeling"
                  icon={<CircleIcon className="purpleStatusDot" />}
                />
              </Stack>
            </Stack>
          </Box>
          <Box width={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width={1}
              borderBottom={`1px solid ${lineColor}`}
            >
              <Typography variant="h5">Repository preview</Typography>
              <Button
                variant="text"
                endIcon={<OpenInNewIcon />}
                sx={{ textTransform: "none", padding: 0 }}
              >
                View on GitHub
              </Button>
            </Box>
            <AboutOSBBox width={1} mt={2} mb={4}>
              <Typography>
                Open Source Brain Showcase project containing examples of
                Neurodata Without Borders (NWB) data. OSB is developing the
                infrastructure to visualise and analyse experimental data in
                neuroscience which has been shared publicly in NWB format.
              </Typography>
              <Typography>
                This repository will contain some example datasets which we will
                convert to NWB to test this functionality.
              </Typography>
              <Typography>
                The target format will be NWB v2.0 and we intend to make use of
                PyNWB for reading/writing the NWB files.
              </Typography>
            </AboutOSBBox>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box width={1}>
            <Typography variant="h5">Select Content</Typography>
            <Box width={1} mt={3} mb={2}>
              <RepoDetailsBreadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </RepoDetailsBreadcrumbs>
            </Box>
            <Box width={1} display="flex">
              <RepoDetailsSearchField
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <RepoDetailsButton
                startIcon={<FilterListIcon />}
                variant="contained"
              >
                All Types
              </RepoDetailsButton>
            </Box>
          </Box>
          <Box width={1} mt={4}>
            <Paper
              elevation={0}
              sx={{ width: "100%", mb: 2, background: "none" }}
            >
              <RepoDetailsList disablePadding>
                <ListSubheader component="div">
                  <Stack direction="row" alignItems="center">
                    <Checkbox
                      color="primary"
                      checked={
                        selected.length > 0 && selected.length === data.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all",
                      }}
                    />
                    <Typography>Name</Typography>
                  </Stack>
                  <Typography>Last Update</Typography>
                </ListSubheader>
                <Divider />
                {data.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `checkbox-${index}`;
                  return (
                    <RepoDetailsListItemButton
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      key={row.name}
                      onClick={(event) => handleClick(event, row.name)}
                    >
                      <Stack direction="row" alignItems="center">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-label": labelId,
                          }}
                        />
                        <ListItemIcon>
                          <InsertDriveFileIcon />
                        </ListItemIcon>
                        <Typography>{row.name}</Typography>
                      </Stack>
                      <ListItemText
                        primary={row.date}
                        sx={{ textAlign: "right" }}
                      />
                    </RepoDetailsListItemButton>
                  );
                })}
              </RepoDetailsList>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </RepoDetailsPageBox>
  );
};

export default RepositoryPageDetails;
