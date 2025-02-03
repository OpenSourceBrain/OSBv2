import * as React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import { AddIcon, BitBucketIcon } from "../icons";
import { bgLight, paragraph } from "../../theme";
import { User } from "../../apiclient/accounts";
import OSBDialog from "../common/OSBDialog";
import Tooltip from "@mui/material/Tooltip";
import LanguageIcon from "@mui/icons-material/Language";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import FormLabel from "../styled/FormLabel";

interface ProfileLink {
  text: string;
  icon: any;
  prefix: string;
}

// This order is followed when data is displayed
const profileMeta: { [key: string]: ProfileLink } = {
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

const styles = {
  avatar: {
    alignSelf: "center",
    height: "70px",
    width: "70px",
    mr: 1,
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
    mr: 1,
    "& .MuiSvgIcon-root": {
      color: paragraph,
    },
  },
};

interface UserEditProps {
  user: User;
  saveUser: (user: User) => void;
  close: () => void;
}

export default (props: UserEditProps) => {
  const [addLinkDialogOpen, setAddLinkDialogOpen] = React.useState(false);

  const profiles = {
    ...Object.keys(profileMeta).reduce(
      (prev, k) => ({ ...prev, [k]: null }),
      {}
    ),
    ...props.user.profiles,
  };
  const [userForm, setProfileForm] = React.useState<User | any>({
    ...props.user,
    profiles,
    groups: undefined
  });
  const [error, setError] = React.useState<any>({});
  const [newLinkInformation, setNewLinkInformation] = React.useState<{
    linkFor: string;
    link: string;
  }>({ linkFor: "", link: "" });

  /* Construct profiles dict from meta and what's provided by user */

  const setWebsiteURLField = (e: any) => {
    const value = e.target.value;
    try {
      if (value) {
        const _ = new URL(value);
      }

      setProfileForm({ ...userForm, website: value });
      setError({ ...error, website: undefined });
    } catch (_) {
      setError({ ...error, website: "Invalid URL" });
    }
  };

  const setProfileURLField = (e: any) => {
    const value = e.target.value;
    try {
      if (value) {
        const _ = new URL(value);
      }
      setError({ ...error, avatar: undefined });
      setProfileForm({ ...userForm, avatar: value });
    } catch (_) {
      setError({ ...error, avatar: "Invalid URL" });
    }
  };

  const setProfileDisplayName = (e: any) => {
    // The first word is the first name, and everything else is the second name
    setProfileForm({
      ...userForm,
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
      setError({ ...error, username: "Username cannot be empty" });
    } else {
      setProfileForm({ ...userForm, username: e.target.value });
      setError({ ...error, username: undefined });
    }
  };

  const setProfileEmailAddress = (e: any) => {
    const value = e.target.value;
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      )
    ) {
      setError({ ...error, email: "Invalid Email" });
    } else {
      setProfileForm({ ...userForm, email: e.target.value });
      setError({ ...error, email: undefined });
    }
  };

  const handleProfileLinkChange = (profileType: string, value: string) => {
    try {
      if (value) {
        const _ = new URL(value);
      }
      setError({ ...error, [profileType]: undefined });
      /* TODO: if the value is "", we should remove this new profile
       * completely Can be done here by removing the profileType from the
       * dict, but also requires updates to the backend to remove the key
       * completely, and not just leave it empty.
       */
      setProfileForm({
        ...userForm,
        profiles: { ...userForm.profiles, [profileType]: value },
      });
    } catch (_) {
      setError({
        ...error,
        [profileType]: `Please enter a valid URL for ${profileType}`,
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
    <OSBDialog
      open={true}
      title="Edit My Profile"
      closeAction={props.close}
      actions={
        <React.Fragment>
          <Button color="primary" onClick={props.close}>
            Cancel
          </Button>{" "}
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.saveUser(userForm)}
          >
            Save Changes
          </Button>
        </React.Fragment>
      }
    >
      <Box p={3}>
        <Box display="flex" flexDirection="row" mb={1}>
          <Avatar
            sx={styles.avatar}
            alt="user-profile-avatar"
            src={userForm.avatar}
          >
            {userForm.firstName?.charAt(0) + userForm.lastName?.charAt(0)}
          </Avatar>
          <Box width="100%">
            <FormLabel>Profile picture URL</FormLabel>
            <TextField
              error={error.avatar}
              helperText={error.avatar}
              id="profilePictureURL"
              fullWidth={true}
              onChange={setProfileURLField}
              variant="outlined"
              defaultValue={userForm.avatar}
            />
          </Box>
        </Box>
        <Box mb={1} mt={1}>
          <FormLabel>Display Name</FormLabel>
          <TextField
            error={error.firstName}
            helperText={error.firstName}
            fullWidth={true}
            onChange={setProfileDisplayName}
            variant="outlined"
            defaultValue={userForm.firstName + " " + userForm.lastName}
          />
        </Box>
        <Box mb={1} mt={1}>
          <FormLabel>Username</FormLabel>
          <TextField
            disabled={true}
            error={error.username}
            helperText={error.username}
            sx={styles.textFieldWithIcon}
            fullWidth={true}
            onChange={setProfileUserName}
            variant="outlined"
            defaultValue={userForm.username}
            InputProps={{
              startAdornment: (
                <Box sx={styles.inputIconBox}>
                  <AlternateEmail fontSize="small" />
                </Box>
              ),
            }}
          />
        </Box>
        {
          props.user.email && <Box mb={1} mt={1}>
            <FormLabel>Email address</FormLabel>
            <TextField
              error={error.email}
              helperText={error.email}
              sx={styles.textFieldWithIcon}
              fullWidth={true}
              onChange={setProfileEmailAddress}
              variant="outlined"
              defaultValue={userForm.email}
              InputProps={{
                startAdornment: (
                  <Box sx={styles.inputIconBox}>
                    <EmailIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
            <Typography
              component="span"
              variant="body1"
              style={{ fontWeight: "normal" }}
            >
              Your email address is private. Other users can't see it.
            </Typography>
          </Box>
        }
        <Box mb={1} mt={1}>
          <FormLabel>Links</FormLabel>
          <Tooltip title="Website link">
            <TextField
              error={error.website}
              helperText={error.website}
              sx={styles.textFieldWithIcon}
              fullWidth={true}
              margin="dense"
              onChange={setWebsiteURLField}
              variant="outlined"
              defaultValue={userForm.website}
              placeholder="https://.."
              InputProps={{
                startAdornment: (
                  <Box sx={styles.inputIconBox}>
                    <LanguageIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Tooltip>
          {Object.entries(userForm.profiles).map((profile) => {
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
                  error={error[profileType]}
                  helperText={error[profileType]}
                  key={profileType}
                  sx={styles.textFieldWithIcon}
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
                      <Box sx={styles.inputIconBox}> {profileTypeIcon} </Box>
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
        {error.general && (
          <Typography color="error">{error.general}</Typography>
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
            sx={styles.textFieldWithIcon}
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
                <Box sx={styles.inputIconBox}>
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
    </OSBDialog>
  );
};
