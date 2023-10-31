import React from "react";
import OSBDialog from "../common/OSBDialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { OSBLogo } from "../icons";

const styles = {
  paper: {
    padding: 2,
    textAlign: "center",
    backgroundColor: "transparent",
  }
};

export const AboutContent = (props: any) => {

  const logoMetaCell = "/images/metacell.png";
  const logoWellcome = "/images/wellcome.png";

  return (
    <Box sx={styles.paper}>
      <OSBLogo sx={{width: "300px", height: "auto"}} />
      <Box>
        <Link
          variant="h5"
          style={{ display: "block" }}
          href="https://github.com/OpenSourceBrain/OSBv2"
          target="_blank"
        >
          Open Source Brain v2.0
        </Link>
      </Box>

      <Box my={2}>
        <Typography variant="body1" >
          Open Source Brain v2.0 (OSBv2) is a cloud based integrated research
          environment for neuroscience. OSBv2 aims to close the loop between
          experimental and computational neuroscience.
        </Typography>
      </Box>

      <Box my={2} pb={2}>
        <Typography variant="body1" >
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

      <Box my={2}>
        <Typography variant="body1">
          OSBv2 is being developed by the{" "}
          <Link href="http://silverlab.org/" target="_blank" underline="hover">
            Silver Lab at University College London
          </Link>{" "}
          in collaboration with{" "}
          <Link href="https://metacell.us" target="_blank" underline="hover">
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
        
      </Box>
      <Box mt={2}>
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
    </Box>
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

