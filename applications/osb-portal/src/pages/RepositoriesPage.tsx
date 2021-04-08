import * as React from "react";
import { OSBRepository } from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";


export const RepositoriesPage = () => {
  const [page, setPage] = React.useState(0);
  const [repositories, setRepositories] = React.useState<OSBRepository[]>();
  React.useEffect(() => {
    RepositoryService.getRepositories(page).then(repos => setRepositories(repos));
  }, [page])

  return (
    <>
      {
        repositories && <>CHANGE ME</>
      }
    </>
  );
};

export default RepositoriesPage