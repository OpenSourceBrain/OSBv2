import * as React from "react";

//components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import ButtonGroup from '@mui/material/ButtonGroup';


//icons
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//style
import { styled } from "@mui/system";
import { bgDarker, secondaryColor, checkBoxColor, bgLight, badgeBgLight, paragraph, bgDarkest, bgLightest, bgInputs } from '../../theme'


const RepoDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
        padding: 0,
        backgroundColor: bgDarker,
        backgroundImage: 'unset',
        borderRadius: '0.143rem',
    },
    "& .MuiDialogContent-root": {
        padding: '0.875rem 1rem',
        display: 'grid',
        gap: '0.875rem',
        marginTop: '0.857rem',
        marginBottom: '1rem',
    },
    "& .MuiDialogTitle-root": {
        padding: '0.857rem 1.143rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `0.071rem solid ${bgLight}`,
        '& .MuiTypography-root': {
            color: secondaryColor,
            fontWeight: 700
        },
        '& .MuiButtonBase-root': {
            alignSelf: 'end',
            padding: 0,
            '& .MuiSvgIcon-root': {
                marginBottom: 0,
                fill: checkBoxColor
            },
            '&:hover': {
                backgroundColor: 'transparent'
            }
        }
    },
    "& .MuiDialogActions-root": {
        padding: '1.143rem',
        background: bgLightest,
        boxShadow: '0px -5px 30px rgba(0, 0, 0, 0.25)',
        border: `0.071rem solid ${bgDarkest}`
    }
}));

const RepoButtonGroup = styled(ButtonGroup)(({ theme }) => ({
    '& .MuiTextField-root': {
        "& .MuiInputBase-root.MuiOutlinedInput-root": {
            borderRadius: '0px 2px 2px 0px'
        },
    }
}))

const Label = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '0.75rem',
    color: badgeBgLight,
    marginBottom: '0.714rem'
}));

const RepoSelect = styled(Select)(({ theme }) => ({
    background: bgLight,
    borderRadius: '2px',
    color: paragraph,
    fontSize: '1rem'
}));

const RepoAutocomplete = styled(Autocomplete)(({ theme }) => ({
    border: 0,
    padding: 0,
    '& .MuiButtonBase-root.MuiChip-root': {
        background: bgDarkest,
    }
}));

const Placeholder = styled(Box)(({ theme }) => ({
    border: `3px dashed ${bgInputs}`,
    padding: '24px',
    textAlign: 'center',
    color: paragraph,
    '& .MuiButton-root': {
        border: `1px solid ${paragraph}`,
        color: paragraph,
        marginTop: '0.75rem'
    }
}));


export default ({ dialogOpen, handleClose }: { dialogOpen: boolean, handleClose: (open: boolean) => any }) => {

    const [url, setUrl] = React.useState('Github');
    const [branch, setBranch] = React.useState('');
    const [type, setType] = React.useState(40);

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    }

    const handleTypeChange = (event) => {
        setType(event.target.value);
    }

    const handleBranchChange = (event) => {
        setBranch(event.target.value);
    };

    return (
        <RepoDialog
            fullWidth
            open={dialogOpen}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>Add repository</Typography>
                <IconButton onClick={() => handleClose(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box>
                    <Label>Source</Label>
                    <RepoButtonGroup fullWidth>
                        <Select
                            sx={{
                                background: bgLight, borderRadius: '2px 0px 0px 2px', width: '30%',
                                "& .MuiOutlinedInput-root:hover": {
                                    "& > fieldset": {
                                        borderColor: bgLightest
                                    }
                                }
                            }}
                            defaultValue={url}
                            onChange={handleUrlChange}
                            inputProps={{ 'aria-label': 'Without label' }}
                            IconComponent={(props) => (<ExpandMoreIcon sx={{ fill: paragraph }} {...props} />)}
                        >
                            <MenuItem value='Github'>Github</MenuItem>
                            <MenuItem value='Gitlab'>Gitlab</MenuItem>
                        </Select>
                        <TextField placeholder="Repository URL" fullWidth sx={{
                            "& .MuiOutlinedInput-root:hover": {
                                "& > fieldset": {
                                    borderColor: bgLightest
                                }
                            }
                        }} />
                    </RepoButtonGroup>
                </Box>
                <Box>
                    <Label>Default branch</Label>
                    <RepoSelect
                        fullWidth
                        value={branch}
                        onChange={handleBranchChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={(props) => (<ExpandMoreIcon sx={{ fill: paragraph }} {...props} />)}
                    >
                        <MenuItem value="">Select branch</MenuItem>
                        <MenuItem value={10}>Main</MenuItem>
                        <MenuItem value={20}>Develop</MenuItem>
                        <MenuItem value={30}>Feature/628</MenuItem>
                    </RepoSelect>
                </Box>
                <Box>
                    <Label>Type</Label>
                    <RepoSelect
                        fullWidth
                        onChange={handleTypeChange}
                        defaultValue={type}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={(props) => (<ExpandMoreIcon sx={{ fill: paragraph }} {...props} />)}
                    >
                        <MenuItem value={40}>NWB Experimental data</MenuItem>
                        <MenuItem value={50}>NWB data</MenuItem>
                        <MenuItem value={60}>NWB</MenuItem>
                    </RepoSelect>
                </Box>
                <Box>
                    <Label>Workspace tags</Label>
                    <RepoAutocomplete
                        multiple
                        options={options}
                        defaultValue={[options[0], options[1], options[2]]}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
                <Box>
                    <Label>Can you describe what people can find in this repository?</Label>
                    <TextField
                        multiline
                        variant="outlined"
                        rows={5}
                        fullWidth
                    />
                </Box>
                <Box>
                    <Label>Repository thumbnail</Label>
                    <Placeholder>
                        <Typography>Drop here to upload...</Typography>
                        <Button variant="outlined">Browse files</Button>
                    </Placeholder>
                </Box>
            </DialogContent>
            <DialogActions sx={{ mt: '1rem' }}>
                <Button variant="text">Cancel</Button>
                <Button variant="contained">Add</Button>
            </DialogActions>

        </RepoDialog>
    );
};

const options = ['testTag', 'testTag', 'testTag', 'testTag', 'testTag']