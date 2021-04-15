import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ClearIcon from '@material-ui/icons/Clear';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { bgLight, primaryColor, bgInputs, fontColor, paragraph, bgLightestShade } from "../../theme";
import { Box, FormControl, Select,Typography, MenuItem, TextField } from '@material-ui/core';
import { RepositoryType } from '../../apiclient/workspaces/models/RepositoryType';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: bgLight,
    },
    '& .MuiSelect-selectMenu': {
      backgroundColor: bgLight,
    },
    '& .MuiSvgIcon-root': {
      color: paragraph
    },
    '& .input-group': {
      marginBottom: theme.spacing(2),
      '& .MuiTypography-root': {
        display: 'block',
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
        color: bgInputs,
      },
      '& .MuiFormControl-root': {
        '&:not(.MuiTextField-root)': {
          width: '9rem',
          flexShrink: 0,
        },
      }
    },
    '& .form-group': {
      '& .MuiTypography-root': {
        display: 'block',
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
        color: bgInputs,
      },
      '&+.form-group': {
        marginTop: theme.spacing(2),
      }
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(3),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(3),
      '& .MuiButton-root': {
        height: '2.13rem',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        '&.MuiButton-containedPrimary': {
          color: fontColor,
          '&:hover': {
            color: primaryColor,
          }
        },
      },
    },

    '& .MuiDialog-paper': {
      backgroundColor: bgLightestShade,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: bgLight,
      boxShadow: '0 10px 60px rgba(0, 0, 0, 0.5);',
    },

    '& .MuiDialogTitle-root': {
      border: 'none',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: bgLight,
      padding: theme.spacing(3),
      '& .MuiTypography-root': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 700,
        '& .MuiSvgIcon-root': {
          cursor: 'pointer',
        }
      },

    },
  }
}));

export const AddRepoDialog = (props: any) => {
  const classes = useStyles();
  const RepoTypes = Object.keys(RepositoryType);
  const { dialogOpen, setDialogOpen } = props;
  const defaultFormValues = {uri: '', defaultContext: '', repositoryContentTypes: '', description: ''}
  const [formValues, setFormValues] = useState({...defaultFormValues})
  const [type, setType] = useState(RepoTypes[0]);
  const [error, setError] = useState({uri: false, defaultContext: false, repositoryContentTypes: false})

  const handleClose = () => {
    setDialogOpen(false)
  };

  const handleInputText = (event: any, key: string) => {
    const value = event.target.value
    setFormValues({...formValues, [key]: value})
    setError({...error, [key]: !Boolean(value)})
  }

  const addRepository = () => {
    setError({uri: formValues.uri === '', defaultContext: formValues.defaultContext === '', repositoryContentTypes: formValues.repositoryContentTypes === ''})
    if(formValues.uri !== '' && formValues.defaultContext !== '' && formValues.repositoryContentTypes !== '') {
      console.log(formValues)
      setFormValues({...defaultFormValues})
      handleClose()
    }
  }


  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      className={classes.root}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Add Repository
        <ClearIcon onClick={handleClose} />
      </DialogTitle>
      <DialogContent>
        <Box className="input-group">
          <Typography component="label">
            Source
          </Typography>
          <Box display="flex">
            <FormControl
            variant="outlined"
          >
            <Select
              value={type}
              onChange={(e: any) => setType(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
            >
              {
                Object.keys(RepositoryType).map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)
              }
            </Select>
          </FormControl>

          <TextField
            fullWidth
            placeholder="Repository URL"
            variant="outlined"
            error={error.uri}
            onChange={(e) => handleInputText(e, 'uri')}
            value={formValues.uri}
          />
          </Box>
        </Box>
        <Box className="form-group">
          <Typography component="label">
            Default Branch
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            error={error.defaultContext}
            onChange={(e) => handleInputText(e, 'defaultContext')}
            value={formValues.defaultContext}
          />
        </Box>

        <Box className="form-group">
          <Typography component="label">
            Type
          </Typography>
          <FormControl
            variant="outlined"
            fullWidth
          >
            <Select
              value={formValues.repositoryContentTypes}
              onChange={(e) => handleInputText(e, 'repositoryContentTypes')}
              IconComponent={KeyboardArrowDownIcon}
              error={error.repositoryContentTypes}
            >
              <MenuItem value={'Experimental'}>NWB Experimental Data</MenuItem>
              <MenuItem value={'Modelling'}>NWB Modelling Data</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box className="form-group">
          <Typography component="label">
            Can you describe what people can find in this repository?
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={6}
            variant="outlined"
            onChange={(e) => handleInputText(e, 'description')}
            value={formValues.description}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button variant="contained" disableElevation onClick={addRepository} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
};
