import { RepositoryType } from "../../apiclient/workspaces";

export default {
  [RepositoryType.Dandi]: "DANDI Archive",
  [RepositoryType.Github]: "GitHub",
  [RepositoryType.Biomodels]: "Biomodels",
} as any;
