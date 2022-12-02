import React from "react";
import OSBDialog from "../common/OSBDialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import makeStyles from '@mui/styles/makeStyles';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import { secondaryColor, bgLight } from "../../theme";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: "center",
  },
  partners: {
    fontSize: "0.9em",
    marginBottom: "0.5em",
  },
}));

export const AboutContent = (props: any) => {
  const classes = useStyles();
  const logoOSB = "/images/osb-logo-full.png";
  const logoMetaCell = "/images/metacell_new.png";
  const logoWellcome = "/images/wellcome.png";

  return (
    <Paper className={classes.paper}>
      <img width="250" src={logoOSB} />
      <Box m={1}>
        <Link
          variant="h5"
          style={{ display: "block" }}
          href="https://github.com/OpenSourceBrain/OSBv2"
          target="_blank"
          underline="hover">
          Open Source Brain v2.0
        </Link>
      </Box>

      <Box m={1}>
        <Typography variant="body2" color={secondaryColor}>
          Open Source Brain v2.0 (OSBv2) is a cloud based integrated research
          environment for neuroscience. OSBv2 aims to close the loop between
          experimental and computational neuroscience.
        </Typography>
      </Box>

      <Box m={1} pb={2}>
        <Typography variant="body2" color={secondaryColor}>
          Please see the project{" "}
          <Link
            href="https://docs.opensourcebrain.org/OSBv2/Overview.html"
            target="_blank"
            underline="hover">
            documentation
          </Link>{" "}
          for more information.
        </Typography>
      </Box>

      <Box m={1}>
        <Typography variant="body2" color={secondaryColor}>
          OSBv2 is being developed by the{" "}
          <Link href="http://silverlab.org/" target="_blank" underline="hover">
            Silver Lab at University College London
          </Link>{" "}
          in collaboration with{" "}
          <Link href="http://metacell.us" target="_blank" underline="hover">
            MetaCell
          </Link>
          , and is funded by{" "}
          <Link href="https://wellcome.org/" target="_blank" underline="hover">
            Wellcome
          </Link>
          . The source code is available on{" "}
          <Link
            href="https://github.com/OpenSourceBrain/OSBv2/"
            target="_blank"
            underline="hover">
            GitHub
          </Link>{" "}
          under the{" "}
          <Link
            href="https://github.com/OpenSourceBrain/OSBv2/blob/develop/LICENSE"
            target="_blank"
            underline="hover">
            MIT License
          </Link>
          .
        </Typography>
        <Link href="http://www.metacell.us" target="_blank" underline="hover">
          <img
            style={{
              width: 150,
              padding: "10px",
            }}
            src={logoMetaCell}
          />
        </Link>
        <Link href="https://wellcome.org/" target="_blank" underline="hover">
          <img
            style={{
              width: 80,
              padding: "10px",
            }}
            src={logoWellcome}
          />
        </Link>
      </Box>
    </Paper>
  );
};

export const AboutDialog = (props: any) => {
  return (
    <OSBDialog
      title="About"
      open={props.aboutDialog}
      closeAction={props.closeDialog}
    >
      <AboutContent />
    </OSBDialog>
  );
};

