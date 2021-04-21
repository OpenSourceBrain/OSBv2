import * as React from "react";
import Divider from "@material-ui/core/Divider";
import { useParams } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

import { OSBRepository } from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";

// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

export const RepositoryPage = (props: any) => {
  const { repositoryId } = useParams<{ repositoryId: string }>();

  const [repository, setRepository] = React.useState<OSBRepository>();

  RepositoryService.getRepository(+repositoryId).then((repo) =>
    setRepository(repo)
  );


  return (
    <>
      {repository ? repository.description : (
        <CircularProgress
          size={48}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -24,
            marginLeft: -24,
          }}
        />
      )}
    </>
  );
};

export default RepositoryPage;