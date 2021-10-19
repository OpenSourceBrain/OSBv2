import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from "@material-ui/core/Avatar";
import AlternateEmail from "@material-ui/icons/AlternateEmail";
import EmailIcon from "@material-ui/icons/Email";
import LinkIcon from "@material-ui/icons/Link";
import GitHubIcon from "@material-ui/icons/GitHub";
import { AddIcon, BitBucketIcon } from "../icons";
import { bgLight } from "../../theme";


const useStyeles = makeStyles((theme) => ({
    avatar: {
        alignSelf: 'center',
        height: '70px',
        width: '70px',
        marginRight: theme.spacing(1),
    },
    textFieldWithIcon: {
        '& .MuiInputBase-root': {
            paddingLeft: 0,
        },
    },
    inputIconBox: {
        height: '60px',
        width: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgLight,
        borderTopLeftRadius: '4px',
        borderBottomLeftRadius: '4px',
        marginRight: theme.spacing(1),
    },
}))

interface UserEditProps {
    closeHandler: () => void;
}

const exampleData = {
    firstName: 'Padraig',
    lastName: 'Gleeson',
    username: 'pglesson',
    numRepositories: 16,
    numWorkspaces: 4,
    webisteLink: 'http://www.neuroconstruct.org',
    githubLink: 'https://github.com/',
    bitbucketLink: 'https://github.com/',
    profileLink: 'https://github.com/',
    group1: "OpenWorm",
    group2: "SilverLab",
    profileImageUrl: '',
    profileDisplayName: 'Padraig Gleeson',
    memberSince: 'March 21st 2011',
}

export default (props: UserEditProps) => {
    const classes = useStyeles();
    const [userProfileForm, setUserProfileForm] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const setProfileURLField = (e: any) => {
        setUserProfileForm({...userProfileForm, profilePictureUrl: e.target.value });
    }

    const setProfileDisplayName = (e: any) => {
        setUserProfileForm({...userProfileForm, displayName: e.target.value });
    }

    const setProfileUserName = (e: any) => {
        setUserProfileForm({...userProfileForm, userName: e.target.value });
    }

    const setProfileEmailAddress = (e: any) => {
        setUserProfileForm({...userProfileForm, emailAddress: e.target.value });
    }

    const setProfileBitBucketLink = (e: any) => {
        setUserProfileForm({...userProfileForm, bitBucketLink: e.target.value });
    }

    const setProfileGitHubLink = (e: any) => {
        setUserProfileForm({...userProfileForm, githubLink: e.target.value });
    }

    const setProfileLink = (e: any) => {
        setUserProfileForm({...userProfileForm, link: e.target.value });
    }

    const handleProfileUpdate = (e: any) => {
        // communicate with backend
        props.closeHandler();
        console.log('save changes to profile button clicked');
    }

    return (
        <>
            <Box p={3}>
                <Box display="flex" flexDirection="row" mb={1}>
                    <Avatar className={classes.avatar} alt="user-profile-avatar" src={exampleData.profileImageUrl}>
                        {exampleData.firstName.charAt(0) + exampleData.lastName.charAt(0)}
                    </Avatar>
                    <Box width="100%">
                        <Typography component="label" variant="h6">Profile picture URL</Typography>
                        <TextField id="profilePictureURL" fullWidth={true} onChange={setProfileURLField} variant="outlined" defaultValue={exampleData.profileImageUrl} />
                    </Box>
                </Box>
                <Box mb={1} mt={1}>
                    <Typography component="label" variant="h6">Display Name</Typography>
                    <TextField fullWidth={true} onChange={setProfileDisplayName} variant="outlined" defaultValue={exampleData.profileDisplayName} />
                </Box>
                <Box mb={1} mt={1}>
                    <Typography component="label" variant="h6">Username</Typography>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} onChange={setProfileUserName} variant="outlined" defaultValue={exampleData.username} InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <AlternateEmail fontSize="small"/>
                            </Box>
                        )
                    }}/>
                </Box>
                <Box mb={1} mt={1}>
                    <Typography component="label" variant="h6">Email address</Typography>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} onChange={setProfileEmailAddress} variant="outlined" defaultValue={exampleData.username} InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <EmailIcon fontSize="small"/>
                            </Box>
                        )
                    }}/>
                    <Typography component="span" variant="h6" style={{ fontWeight: 'normal' }}>Your email address is private. Other users can't see it.</Typography>
                </Box>
                <Box mb={1} mt={1}>
                    <Typography component="label" variant="h6">Links</Typography>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} onChange={setProfileLink} variant="outlined" defaultValue={exampleData.profileLink} InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <LinkIcon fontSize="small"/>
                            </Box>
                        )
                    }}/>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} margin="normal" onChange={setProfileLink} variant="outlined" defaultValue={exampleData.profileLink} InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <LinkIcon fontSize="small"/>
                            </Box>
                        )
                    }}/>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} margin="normal" onChange={setProfileBitBucketLink} variant="outlined" defaultValue={exampleData.bitbucketLink} InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <BitBucketIcon />
                            </Box>
                        )
                    }}/>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} margin="normal" onChange={setProfileBitBucketLink} variant="outlined" defaultValue={exampleData.bitbucketLink} InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <GitHubIcon fontSize="small"/>
                            </Box>
                        )
                    }}/>
                </Box>
                <Box>
                    <Button variant="outlined" color="primary" fullWidth={true}><AddIcon /> Add link</Button>
                </Box>
            </Box>
            <Box mt={1} p={2} textAlign="right" bgcolor={bgLight}>
                <Button color="primary" onClick={props.closeHandler}>Cancel</Button>
                <Button variant="contained" color="primary" disabled={loading} onClick={handleProfileUpdate}>Save Changes</Button>
                {loading &&
                    <CircularProgress
                        size={24}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -12,
                            marginLeft: -12,
                        }}
                    />
                }
            </Box>
        </>
    )
}