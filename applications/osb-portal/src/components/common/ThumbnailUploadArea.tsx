import * as React from "react";
import Dropzone from "react-dropzone";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";

//icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

//style
import styled from "@mui/system/styled";
import { radius, gutter, bgInputs } from "../../theme";

// import style manually
import { alpha } from "@mui/material/styles";


const MAX_ALLOWED_THUMBNAIL_SIZE = 1024 * 1024; // 1MB

export const StyledDropZoneBox = styled(Box)(({ theme }) => ({
	color: bgInputs,
	border: `2px dashed ${bgInputs}`,
	borderRadius: 5,
	padding: 4,
	"& .MuiTypography-subtitle2": {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},
	"& .MuiButton-outlined": {
		margin: "0 auto",
		display: "flex",
		justifyContent: "center",
		color: bgInputs,
		borderRadius: radius,
		border: `2px solid ${bgInputs}`,
	},
}));

export const StyledImagePreviewSection = styled("section")(() => ({
	display: "flex",
	minHeight: "15em",
	alignItems: "stretch",
	backgroundPosition: "center",
	backgroundSize: "cover",
	flex: 1,
}));

export const dropAreaStyle = (error: any) => ({
	flex: 1,
	display: "flex",
	alignItems: "center",
	borderRadius: radius,
	padding: gutter,
	borderColor: error ? "red" : alpha(bgInputs, 1),
});


interface UploadAreaProps {
	setThumbnail: any;
	thumbnail: any;
	thumbnailError: any;
	setThumbnailError: any;
	workspace: any;
}

export const OSBDialog: React.FunctionComponent<UploadAreaProps> = ({
	setThumbnail,
	thumbnail,
	thumbnailError,
	setThumbnailError,
	workspace
}) => {
	const [thumbnailPreview, setThumbnailPreview] = React.useState<any>(
		workspace?.thumbnail ? "/proxy/workspaces/" + workspace.thumbnail : null
	);


	const dropThumbnail = (uploadedThumbnail: any) => {
		setThumbnail(uploadedThumbnail);
		previewFile(uploadedThumbnail);
	};

	const previewFile = (file: Blob) => {
		if (!file) {
			setThumbnailError(null);
			setThumbnailPreview(null);
			return;
		}

		if (!file.type.includes("image")) {
			setThumbnailError("Not an image file");
			return;
		}
		if (file.size > MAX_ALLOWED_THUMBNAIL_SIZE) {
			setThumbnailError("File exceeds allowed size (1MB)");
			return;
		}

		setThumbnailError(null);

		const fileReader: FileReader = new FileReader();

		fileReader.onload = () => {
			setThumbnailPreview(fileReader.result);
		};

		fileReader.readAsDataURL(file);
	};
	return (
		<StyledDropZoneBox alignItems="stretch">
			<Dropzone
				onDrop={(acceptedFiles: any) => {
					dropThumbnail(acceptedFiles[0]);
				}}
			>
				{({
					getRootProps,
					getInputProps,
					acceptedFiles,
				}: {
					getRootProps: (p: any) => any;
					getInputProps: () => any;
					acceptedFiles: any[];
				}) => (
					<StyledImagePreviewSection
						style={{
							backgroundImage:
								!thumbnailError && `url(${thumbnailPreview})`,
						}}
					>
						<div
							{...getRootProps({
								style: dropAreaStyle(thumbnailError),
							})}
						>
							<input {...getInputProps()} />
							<Grid
								container={true}
								justifyContent="center"
								alignItems="center"
								direction="row"
							>
								{thumbnail && (
									<Grid item={true}>
										{!thumbnail ? (
											""
										) : (
											<IconButton
												onClick={(e: any) => {
													e.preventDefault();
													dropThumbnail(null);
												}}
												size="large"
											>
												<DeleteForeverIcon />
											</IconButton>
										)}
									</Grid>
								)}
								<Grid item={true}>
									<Box component="div" m={1}>
										{!thumbnail ? (
											<>
												<span>Drop file here to upload...</span>
												<Button
													variant="outlined"
													sx={{ margin: "auto !important" }}
												>
													Browse files
												</Button>
											</>
										) : null}

										{thumbnailError && (
											<Typography
												color="error"
												variant="subtitle2"
												component="p"
											>
												{thumbnailError}
											</Typography>
										)}
									</Box>
								</Grid>
							</Grid>
						</div>
					</StyledImagePreviewSection>
				)}
			</Dropzone>
		</StyledDropZoneBox>

	);
};

export default OSBDialog;
