import { Configuration } from "../apiclient/accounts";
import * as accountsApi from "../apiclient/accounts/apis";

const accountsApiUri = "/proxy/accounts-api/api";

class GroupsService {
  groupsApi: accountsApi.GroupsApi = null;
  accessToken: string = null;

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.groupsApi = new accountsApi.GroupsApi(
      new Configuration({ basePath: accountsApiUri, accessToken: token })
    );
  };

  async getGroup(groupname: string) {
    return this.groupsApi.getGroup({ groupname })
  }

  async getGroupMembers(groupname: string) {
    return this.groupsApi.getGroupUsers({ groupname })
  }
}


export default new GroupsService()
