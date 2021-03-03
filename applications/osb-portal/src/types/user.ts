import { User } from '../apiclient/workspaces';

// UserInfo object

export interface UserInfo extends User {
    isAdmin: boolean;
}
