import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import AlternateEmail from "@material-ui/icons/AlternateEmail";
import EmailIcon from "@material-ui/icons/Email";
import LinkIcon from "@material-ui/icons/Link";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import { AddIcon, BitBucketIcon } from "../icons";
import { bgLight, paragraph } from "../../theme";
import { User } from "../../apiclient/accounts";
import OSBDialog from "../common/OSBDialog";
import Tooltip from "@material-ui/core/Tooltip";
import LanguageIcon from "@material-ui/icons/Language";
import GroupIcon from "@material-ui/icons/Group";
import BusinessIcon from "@material-ui/icons/Business";

// This order is followed when data is displayed
const profileMeta: { [key: string]: { [key: string]: any } } = {
  affiliation: {
    text: "Affiliation",
    icon: BusinessIcon,
    prefix: "https://..",
  },
  github: {
    text: "GitHub",
    icon: GitHubIcon,
    prefix: "https://github.com/",
  },
  bitbucket: {
    text: "BitBucket",
    icon: BitBucketIcon,
    prefix: "https://bitbucket.com/",
  },
  twitter: {
    text: "Twitter",
    icon: TwitterIcon,
    prefix: "https://twitter.com/",
  },
  incf: {
    text: "INCF",
    icon: GroupIcon,
    prefix: "https://incf.org/",
  },
  orcid: {
    text: "ORCID",
    icon: GroupIcon,
    prefix: "https://orcid.org/",
  },
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    alignSelf: "center",
    height: "70px",
    width: "70px",
    marginRight: theme.spacing(1),
  },
  textFieldWithIcon: {
    "& .MuiInputBase-root": {
      paddingLeft: 0,
    },
  },
  inputIconBox: {
    height: "60px",
    width: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bgLight,
    borderTopLeftRadius: "4px",
    borderBottomLeftRadius: "4px",
    marginRight: theme.spacing(1),
    "& .MuiSvgIcon-root": {
      color: paragraph,
    },
  },
}));

interface UserEditProps {
  user: User;
  profileForm: any;
  setProfileForm: any;
  error: any;
  setError: any;
}

export default (props: UserEditProps) => {
  const classes = useStyles();
  const [addLinkDialogOpen, setAddLinkDialogOpen] = React.useState(false);
  const [newLinkInformation, setNewLinkInformation] = React.useState<{
    linkFor: string;
    link: string;
  }>({ linkFor: "", link: "" });

  /* Construct profiles dict from meta and what's provided by user */
  const temp: any = {};
  Object.keys(profileMeta).map((k) => (temp[k] = null));
  const profiles = { ...temp, ...props.user.profiles };

  const setWebsiteURLField = (e: any) => {
    const value = e.target.value;
    try {
      if (value) {
        const _ = new URL(value);
      }

      props.setProfileForm({ ...props.profileForm, website: value });
      props.setError({ ...props.error, website: undefined });
    } catch (_) {
      props.setError({ ...props.error, website: "Invalid URL" });
    }
  };

  const setProfileURLField = (e: any) => {
    const value = e.target.value;
    try {
      if (value) {
        const _ = new URL(value);
      }
      props.setError({ ...props.error, avatar: undefined });
      props.setProfileForm({ ...props.profileForm, avatar: value });
    } catch (_) {
      props.setError({ ...props.error, avatar: "Invalid URL" });
    }
  };

  const setProfileDisplayName = (e: any) => {
    // The first word is the first name, and everything else is the second name
    props.setProfileForm({
      ...props.profileForm,
      firstName: e.target.value.split(" ")[0],
      lastName:
        e.target.value.split(" ").length > 1
          ? e.target.value.split(" ").slice(1).join(" ")
          : null,
    });
  };

  const setProfileUserName = (e: any) => {
    const value = e.target.value;
    if (!value) {
      props.setError({ ...props.error, username: "Username cannot be empty" });
    } else {
      props.setProfileForm({ ...props.profileForm, username: e.target.value });
      props.setError({ ...props.error, username: undefined });
    }
  };

  const setProfileEmailAddress = (e: any) => {
    const value = e.target.value;
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      )
    ) {
      props.setError({ ...props.error, email: "Invalid Email" });
    } else {
      props.setProfileForm({ ...props.profileForm, email: e.target.value });
      props.setError({ ...props.error, email: undefined });
    }
  };

  const handleProfileLinkChange = (profileType: string, value: string) => {
    try {
      if (value) {
        const _ = new URL(value);
      }
      props.setError({ ...props.error, [profileType]: undefined });
      /* TODO: if the value is "", we should remove this new profile
       * completely Can be done here by removing the profileType from the
       * dict, but also requires updates to the backend to remove the key
       * completely, and not just leave it empty.
       */
      props.setProfileForm({
        ...props.profileForm,
        profiles: { ...props.profileForm.profiles, [profileType]: value },
      });
    } catch (_) {
      props.setError({
        ...props.error,
        [profileType]: `Please enter your ${profileType} profile address`,
      });
    }
  };

  const addNewProfileLink = (e: any) => {
    setAddLinkDialogOpen(false);
    handleProfileLinkChange(
      newLinkInformation.linkFor,
      newLinkInformation.link
    );
  };

  return (
    <>
      <Box p={3}>
        <Box display="flex" flexDirection="row" mb={1}>
          <Avatar
            className={classes.avatar}
            alt="user-profile-avatar"
            src={props.profileForm.avatar}
          >
            {props.profileForm.firstName?.charAt(0) +
              props.profileForm.lastName?.charAt(0)}
          </Avatar>
          <Box width="100%">
            <Typography component="label" variant="h6">
              Profile picture URL
            </Typography>
            <TextField
              error={props.error.avatar}
              helperText={props.error.avatar}
              id="profilePictureURL"
              fullWidth={true}
              onChange={setProfileURLField}
              variant="outlined"
              defaultValue={props.profileForm.avatar}
            />
          </Box>
        </Box>
        <Box mb={1} mt={1}>
          <Typography component="label" variant="h6">
            Display Name
          </Typography>
          <TextField
            error={props.error.firstName}
            helperText={props.error.firstName}
            fullWidth={true}
            onChange={setProfileDisplayName}
            variant="outlined"
            defaultValue={
              props.profileForm.firstName + " " + props.profileForm.lastName
            }
          />
        </Box>
        <Box mb={1} mt={1}>
          <Typography component="label" variant="h6">
            Username
          </Typography>
          <TextField
            disabled={true}
            error={props.error.username}
            helperText={props.error.username}
            className={classes.textFieldWithIcon}
            fullWidth={true}
            onChange={setProfileUserName}
            variant="outlined"
            defaultValue={props.profileForm.username}
            InputProps={{
              startAdornment: (
                <Box className={classes.inputIconBox}>
                  <AlternateEmail fontSize="small" />
                </Box>
              ),
            }}
          />
        </Box>
        <Box mb={1} mt={1}>
          <Typography component="label" variant="h6">
            Email address
          </Typography>
          <TextField
            error={props.error.email}
            helperText={props.error.email}
            className={classes.textFieldWithIcon}
            fullWidth={true}
            onChange={setProfileEmailAddress}
            variant="outlined"
            defaultValue={props.profileForm.email}
            InputProps={{
              startAdornment: (
                <Box className={classes.inputIconBox}>
                  <EmailIcon fontSize="small" />
                </Box>
              ),
            }}
          />
          <Typography
            component="span"
            variant="h6"
            style={{ fontWeight: "normal" }}
          >
            Your email address is private. Other users can't see it.
          </Typography>
        </Box>
        <Box mb={1} mt={1}>
          <Typography component="label" variant="h6">
            Links
          </Typography>
          <Tooltip title="Website link">
            <TextField
              error={props.error.website}
              helperText={props.error.website}
              className={classes.textFieldWithIcon}
              fullWidth={true}
              margin="dense"
              onChange={setWebsiteURLField}
              variant="outlined"
              defaultValue={props.profileForm.website}
              placeholder="https://.."
              InputProps={{
                startAdornment: (
                  <Box className={classes.inputIconBox}>
                    <LanguageIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Tooltip>
          {Object.entries(profiles).map((profile) => {
            const profileType = profile[0];
            let profileTypeText = profileType;
            let profileTypeIcon: any = React.createElement(LinkIcon, {
              fontSize: "small",
            });
            let profileTypePrefix = "";

            if (profileType in profileMeta) {
              profileTypeText = profileMeta[profileType].text;
              profileTypeIcon = React.createElement(
                profileMeta[profileType].icon,
                { fontSize: "small" }
              );
              profileTypePrefix = profileMeta[profileType].prefix;
            }
            const profileLinkOrId = profile[1];

            return (
              <Tooltip key={profileType} title={`${profileTypeText} link`}>
                <TextField
                  error={props.error[profileType]}
                  helperText={props.error[profileType]}
                  key={profileType}
                  className={classes.textFieldWithIcon}
                  fullWidth={true}
                  margin="dense"
                  variant="outlined"
                  defaultValue={profileLinkOrId}
                  placeholder={profileTypePrefix}
                  onChange={(event) => {
                    handleProfileLinkChange(profileType, event.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box className={classes.inputIconBox}>
                        {" "}
                        {profileTypeIcon}{" "}
                      </Box>
                    ),
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onClick={() => setAddLinkDialogOpen(true)}
          >
            <AddIcon /> Add link
          </Button>
        </Box>
      </Box>

      <Box mt={1} p={2} textAlign="right" bgcolor={bgLight}>
        {props.error.general && (
          <Typography color="error">{props.error.general}</Typography>
        )}
      </Box>
      <OSBDialog
        open={addLinkDialogOpen}
        title="Add new link"
        closeAction={() => setAddLinkDialogOpen(false)}
      >
        <Box p={3}>
          <TextField
            fullWidth={true}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setNewLinkInformation({
                ...newLinkInformation,
                linkFor: e.target.value.replace(/\s+/g, ""),
              })
            }
            placeholder="What is this link for?"
          />
          <TextField
            className={classes.textFieldWithIcon}
            fullWidth={true}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setNewLinkInformation({
                ...newLinkInformation,
                link: e.target.value,
              })
            }
            placeholder="Link"
            InputProps={{
              startAdornment: (
                <Box className={classes.inputIconBox}>
                  <LinkIcon fontSize="small" />
                </Box>
              ),
            }}
          />
        </Box>
        <Box textAlign="right" bgcolor={bgLight} mt={1} p={2}>
          <Button color="primary" onClick={() => setAddLinkDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              newLinkInformation.linkFor.length < 0 ||
              newLinkInformation.link.length < 0
            }
            variant="contained"
            color="primary"
            onClick={addNewProfileLink}
          >
            Add new link
          </Button>
        </Box>
      </OSBDialog>
    </>
  );
};
