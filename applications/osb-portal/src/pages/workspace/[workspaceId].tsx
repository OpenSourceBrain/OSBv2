import * as React from "react";
import Divider from "@material-ui/core/Divider";
import workspaceService from '../../service/WorkspaceService';

import {
  WorkspaceDrawer,
  WorkspaceFrame
} from "../../components";
import { Workspace } from "../../types/workspace";

// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

const WorkspacePage = ({ workspace }: { workspace: Workspace }) => {

  return (
    <>
      <Divider variant="fullWidth" />
      <WorkspaceDrawer>
        <WorkspaceFrame workspace={workspace} user={null} />
      </WorkspaceDrawer>
    </>
  );
};

export async function getServerSideProps({ params }: { params: { workspaceId: number } }) {
  const { workspaceId } = params;
  const workspace = await workspaceService.getWorkspace(workspaceId);
  return {
    props: {
      workspace
    }, // will be passed to the page component as props
  }
}

export default WorkspacePage;
