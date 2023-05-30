export const USER_QUOTAS = {
  "quota-ws-maxcpu": {
    label: "Maximum CPU",
    showGB: false,
    description: "sets the storage dedicated to the user data in Gb"
  },
  "quota-ws-maxmem": {
    label: "Maximum memory",
    showGB: true,
    description: "Sets the memory limit on a single workspace in Gb",
  },
  "quota-ws-max": {
    label: "Maximum workspaces",
    showGB: false,
    description: "Limits the number of total owned workspaces for the user"
  },
  "quota-ws-open": {
    label: "Concurrent workspaces",
    showGB: false,
    description: "Limits the maximum number of workspaces open concurrently"
  },
  "quota-ws-storage-max": {
    label: "Available storage per workspace",
    showGB: true,
    description: "Set the storage dedicated to a single workspace in Gb"
  },
  "quota-storage-max": {
    label: "User shared storage",
    showGB: true,
    description: "Sets the storage dedicated to the user data in Gb"
  }
}
