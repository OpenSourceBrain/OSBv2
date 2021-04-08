import * as React from "react";
import Divider from "@material-ui/core/Divider";
import { useParams } from "react-router-dom";



// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

export const RepositoryPage = (props: any) => {
  const { repositoryId } = useParams<{ repositoryId: string }>();



  return (
    <>

    </>
  );
};

export default RepositoryPage;