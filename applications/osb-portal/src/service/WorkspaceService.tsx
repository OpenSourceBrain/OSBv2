import { Workspace } from "../types/workspace";
import { FeaturedType, OSBApplication } from '../types//global'


class WorkspaceService {
  getWorkspace(id: string): Workspace {
    // TODO connect with backend
    return {
      name: "My workspace",
      id: "1",
      volume: "1",
      description: "# Workspace descrition\n\ntext text",
      image: null,
      owner: "1",
      lastEdited: Date(),
      lastApplicationEdit: OSBApplication.nwbexplorer,
      shareType: FeaturedType.Private,
      lastEditedUserId: "1",
      types: [OSBApplication.nwbexplorer]

    };
  }
}

export default new WorkspaceService();
