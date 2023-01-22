import * as React from "react";

//theme
import { styled } from "@mui/styles";
import { chipBg, secondaryColor } from "../../theme";

//components
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Resources from "./resources";

//icons
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { OSBRepository } from "../../apiclient/workspaces";
import Link from "@mui/material/Link";

const RepoPageBannerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  "& .MuiTypography-h1": {
    fontWeight: 400,
  },
  "& .MuiChip-root": {
    background: chipBg,
    margin: "0.25rem",
  },
}));

const RepositoryPageBanner = ({
  repository,
  openRepoUrl,
}: {
  repository: OSBRepository;
  openRepoUrl: () => void;
}) => {
  console.log(repository);
  return (
    repository && (
      <RepoPageBannerBox mt={5} mb={5}>
        <Typography variant="h1">{repository?.name}</Typography>
        <Box sx={{ textAlign: "center", maxWidth: 600 }}>
          {repository?.tags?.map(({ tag, id }, index) => {
            return <Chip label={tag} key={id} />;
          })}
        </Box>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" alignItems="center">
            <IconButton>
              <PersonOutlineIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ display: "inline-flex", alignItems: "baseline" }}
            >
              By
              <Link href={`/user/${repository?.user?.id}`}>
                <Typography variant="body2" color="primary" sx={{ ml: "3px" }}>
                  {repository?.user?.firstName +
                    " " +
                    repository?.user?.lastName}
                </Typography>
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <IconButton>
              <CalendarTodayOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">
              {repository?.timestampCreated &&
                `Last Updated ${repository?.timestampUpdated?.toDateString()}`}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Button
              startIcon={<LinkOutlinedIcon fontSize="small" />}
              onClick={openRepoUrl}
              variant="text"
              size="small"
              sx={{
                color: secondaryColor,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              {Resources[repository?.repositoryType] ||
                repository?.repositoryType}
            </Button>
          </Stack>
        </Stack>
      </RepoPageBannerBox>
    )
  );
};

export default RepositoryPageBanner;
