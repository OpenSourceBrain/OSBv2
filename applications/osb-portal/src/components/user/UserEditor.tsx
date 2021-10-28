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
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import { AddIcon, BitBucketIcon } from "../icons";
import { bgLight, paragraph } from "../../theme";
import { User } from "../../apiclient/accounts";
import { updateUser } from "../../service/UserService";
import OSBDialog from "../common/OSBDialog";


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
        '& .MuiSvgIcon-root': {
            color: paragraph,
        },
    },
}))

interface UserEditProps {
    closeHandler: () => void;
    user: User;
}

export default (props: UserEditProps) => {
    const classes = useStyeles();
    const [userProfileForm, setUserProfileForm] = React.useState<any>({...props.user});
    delete userProfileForm.groups;
    const [loading, setLoading] = React.useState(false);
    const [addLinkDialogOpen, setAddLinkDialogOpen] = React.useState(false);
    const [newLinkInformation, setNewLinkInformation] = React.useState<{linkFor: string, link: string}>({linkFor: '', link: ''});
    const GITHUB_PROFILE = 'github';
    const BITBUCKET_PROFILE = 'bitbucket';
    const TWITTER_PROFILE = 'twitter';
    const ORCID_PROFILE = 'orcid';
    const NEUROTREE_PROFILE = 'neurotree';
    const ICNF_PROFILE = 'icnf';

    const [userProfiles, setUserProfiles] = React.useState<{}>({
        icnf: userProfileForm.profiles.icnf ? userProfileForm.profiles.icnf : undefined,
        github: userProfileForm.profiles.github ? userProfileForm.profiles.github : undefined,
        bitbucket: userProfileForm.profiles.bitBucket ? userProfileForm.profiles.bitBucket : undefined,
        twitter: userProfileForm.profiles.twitter ? userProfileForm.profiles.twitter : undefined,
        orcid: userProfileForm.profiles.orcid ? userProfileForm.profiles.orcid : undefined,
        neurotree: userProfileForm.profiles.neurotree ? userProfileForm.profiles.neuroTree : undefined,
        ...userProfileForm.profiles,
    });

    console.log('user from props', userProfileForm);
    console.log('user profiles', userProfiles);

    const setWebsiteURLField = (e: any) => {
        setUserProfileForm({...userProfileForm, website: e.target.value });
    }

    const setProfileURLField = (e: any) => {
        setUserProfileForm({...userProfileForm, avatar: e.target.value });
    }

    const setProfileDisplayName = (e: any) => {
        setUserProfileForm({...userProfileForm, firstName: e.target.value.split(' ')[0], lastName: e.target.value.split(' ').length > 1 ? e.target.value.split(' ')[1] : null });
    }

    const setProfileUserName = (e: any) => {
        setUserProfileForm({...userProfileForm, username: e.target.value });
    }

    const setProfileEmailAddress = (e: any) => {
        setUserProfileForm({...userProfileForm, email: e.target.value });
    }

    const handleProfileLinkChange = (profileType: string, value: string) => {
        setUserProfiles({...userProfiles, [profileType]: value });
        setUserProfileForm({...userProfileForm, profiles: userProfiles });
    }

    const addNewProfileLink = (e: any) => {
        setAddLinkDialogOpen(false);
        handleProfileLinkChange(newLinkInformation.linkFor, newLinkInformation.link);
    }

    const handleUserUpdate = (e: any) => {
        setLoading(true);
        console.log('updated user profile', userProfileForm);
        updateUser(userProfileForm).then(() => {
            console.log('user should be updated');
            setLoading(false);
        }).catch(() => {
            console.log('error updating user');
        })
        props.closeHandler();
        console.log('save changes to profile button clicked');
    }

    return (
        <>
            <Box p={3}>
                <Box display="flex" flexDirection="row" mb={1}>
                    <Avatar className={classes.avatar} alt="user-profile-avatar" src={userProfileForm.avatar}>
                        {userProfileForm.firstName?.charAt(0) + userProfileForm.lastName?.charAt(0)}
                    </Avatar>
                    <Box width="100%">
                        <Typography component="label" variant="h6">Profile picture URL</Typography>
                        <TextField id="profilePictureURL" fullWidth={true} onChange={setProfileURLField} variant="outlined" defaultValue={userProfileForm.avatar} />
                    </Box>
                </Box>
                <Box mb={1} mt={1}>
                    <Typography component="label" variant="h6">Display Name</Typography>
                    <TextField fullWidth={true} onChange={setProfileDisplayName} variant="outlined" defaultValue={userProfileForm.firstName + ' ' + userProfileForm.lastName} />
                </Box>
                <Box mb={1} mt={1}>
                    <Typography component="label" variant="h6">Username</Typography>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} onChange={setProfileUserName} variant="outlined" defaultValue={userProfileForm.username} InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <AlternateEmail fontSize="small"/>
                            </Box>
                        )
                    }}/>
                </Box>
                <Box mb={1} mt={1}>
                    <Typography component="label" variant="h6">Email address</Typography>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} onChange={setProfileEmailAddress} variant="outlined" defaultValue={userProfileForm.email} InputProps={{
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
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} margin="dense" onChange={setWebsiteURLField} variant="outlined" defaultValue={userProfileForm.website} placeholder="Website link" InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <LinkIcon fontSize="small"/>
                            </Box>
                        )
                    }}/>

                    {
                        Object.entries(userProfiles).map((profile => {
                            const profileType = profile[0];
                            const profileLinkOrId = profile[1];
                            return <TextField key={profileType} className={classes.textFieldWithIcon} fullWidth={true} margin="dense" variant="outlined" defaultValue={profileLinkOrId}
                            placeholder={profileType === ICNF_PROFILE ? "ICNF link" : profileType === GITHUB_PROFILE ? "Github link" : profileType === BITBUCKET_PROFILE ? "Bitbucket link" : profileType === TWITTER_PROFILE ? "Twitter link" : profileType === ORCID_PROFILE ? "Orcid ID" : profileType === NEUROTREE_PROFILE ? "Neurotree ID" : "" }
                            onChange={(event) => {handleProfileLinkChange(profileType, event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <Box className={classes.inputIconBox}>
                                        {
                                            profileType === GITHUB_PROFILE ? <GitHubIcon fontSize="small"/> : profileType === BITBUCKET_PROFILE ? <BitBucketIcon /> : profileType === TWITTER_PROFILE ? <TwitterIcon fontSize="small"/> : <LinkIcon fontSize="small" />
                                        }
                                    </Box>
                                )
                            }}/>
                        }))
                    }

                </Box>
                <Box>
                    <Button variant="outlined" color="primary" fullWidth={true} onClick={() => setAddLinkDialogOpen(true)}><AddIcon /> Add link</Button>
                </Box>
            </Box>
            <Box mt={1} p={2} textAlign="right" bgcolor={bgLight}>
                <Button color="primary" onClick={props.closeHandler}>Cancel</Button>
                <Button variant="contained" color="primary" disabled={loading} onClick={handleUserUpdate}>Save Changes</Button>
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
            <OSBDialog open={addLinkDialogOpen} title="Add new link" closeAction={() => setAddLinkDialogOpen(false)}>
                <Box p={3}>
                    <TextField fullWidth={true} margin="normal" variant="outlined" onChange={(e) => setNewLinkInformation({...newLinkInformation, linkFor: e.target.value.replace(/\s+/g, '')})} placeholder="What is this link for?"/>
                    <TextField className={classes.textFieldWithIcon} fullWidth={true} margin="normal" variant="outlined" onChange={(e) => setNewLinkInformation({...newLinkInformation, link: e.target.value})} placeholder="Link" InputProps={{
                        startAdornment: (
                            <Box className={classes.inputIconBox}>
                                <LinkIcon fontSize="small" />
                            </Box>
                        )
                    }}/>
                </Box>
                <Box textAlign="right" bgcolor={bgLight} mt={1} p={2}>
                    <Button color="primary" onClick={() => setAddLinkDialogOpen(false)}>Cancel</Button>
                    <Button disabled={newLinkInformation.linkFor.length < 0 || newLinkInformation.link.length < 0}
                    variant="contained" color="primary" onClick={addNewProfileLink}>Add new link</Button>
                </Box>
            </OSBDialog>
        </>
    )
}