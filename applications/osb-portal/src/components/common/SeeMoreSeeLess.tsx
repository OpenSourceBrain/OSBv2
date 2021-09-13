import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { linkColor } from "../../theme";

interface SeeMoreSeeLessProps {
    text: string;
}

const useStyles = makeStyles((theme) => ({
    p: {
        lineHeight: '1rem',
        height: '4rem',
        overflow: 'hidden',
    },
    button: {
        textTransform: 'lowercase',
        minWidth: 'fit-content !important',
        padding: 0,
        "& .MuiSvgIcon-root": {
            color: `${linkColor} !important`,
        }
    },
}));

export default(props: SeeMoreSeeLessProps) => {
    const classes = useStyles();
    const [paragraphHeight, setParagraphHeight] = React.useState("4rem");
    const [seeMore, setSeeMore] = React.useState(true);
    const pRef = React.useRef(null);
    const [overflowHappened, setOverFlowHappened] = React.useState(false);

    React.useEffect(() => {
        if (props.text){
            if (pRef.current.scrollHeight > pRef.current.clientHeight) {
                setOverFlowHappened(true);
            }
            else {
                setParagraphHeight("auto");
            }
        }
    }, [props.text]);

    const showMore = () => {
        setSeeMore(!seeMore);
        if (paragraphHeight === "4rem") {
            setParagraphHeight("auto");
        }
        else {
            setParagraphHeight("4rem");
        }
    }


    return(
        <Box>
            <Typography ref={pRef} component="p" className={`${classes.p} paragraph`} style={{ height: paragraphHeight}}>
            {props.text}
        </Typography>
            { props.text && overflowHappened &&
                (seeMore ? <Button onClick={showMore} className={classes.button} color="primary" endIcon={<ExpandMoreIcon />}>Show more</Button> :
                <Button onClick={showMore} className={classes.button} color="primary" endIcon={<ExpandLessIcon />}>Show less</Button>)
            }
        </Box>
    );
}