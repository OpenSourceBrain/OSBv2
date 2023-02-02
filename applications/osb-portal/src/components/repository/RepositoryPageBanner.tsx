import * as React from "react";

//theme
import { styled } from "@mui/styles";
import { chipBg, secondaryColor, primaryColor } from "../../theme";

//components
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Resources from "./resources";
import Link from "@mui/material/Link";

//icons
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

//types
import { OSBRepository } from "../../apiclient/workspaces";

const RepoPageBannerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(5),
  minHeight: "200px",
  
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
  return (
    repository && (
      <RepoPageBannerBox>
        <Typography variant="h1" component="h1" align="center" sx={{ lineHeight: "1.6" }}>
          {repository?.name}
        </Typography>
        <Box sx={{ textAlign: "center", maxWidth: 600 }}>
          {repository?.tags?.map(({ tag, id }, index) => {
            return <Chip label={tag} key={id} />;
          })}
        </Box>
        <Box>
          <Chip
            sx={{ background: "transparent !important", maxWidth: "none" }}
            icon={<PersonOutlineIcon sx={{ fontSize: "1.2rem" }} />}
            label={
              <Typography variant="body2">
                By{" "}
                <Link href={`/user/${repository?.user?.id}`} underline="hover">
                  <span>
                    {repository?.user?.firstName +
                      " " +
                      repository?.user?.lastName}
                  </span>
                </Link>
              </Typography>
            }
          />

          <Chip
            sx={{ background: "transparent !important", maxWidth: "none"  }}
            icon={<CalendarTodayOutlinedIcon sx={{ fontSize: "1.2rem" }} />}
            label={
              <Typography variant="body2">
                {repository?.timestampCreated &&
                  `Last Updated ${repository?.timestampUpdated?.toDateString()}`}
              </Typography>
            }
          />

          <Chip
            onClick={openRepoUrl}
            sx={{
              background: "transparent !important",
              "&:hover": { color: primaryColor },
              maxWidth: "none" 
            }}
            icon={<LinkOutlinedIcon sx={{ fontSize: "1.2rem" }} />}
            label={
              <Typography variant="body2">
                {Resources[repository?.repositoryType] ||
                  repository?.repositoryType}
              </Typography>
            }
          />
        </Box>
      </RepoPageBannerBox>
    )
  );
};

export default RepositoryPageBanner;
