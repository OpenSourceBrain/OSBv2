# Manage user quotas

User quotas are based on keycloak groups and user attributes

## Attributes

- `quota-ws-max`: Limits the number of total owned workspaces for the user
- `quota-ws-open`: limits the maximum number of workspaces open concurrently
- `quota-ws-guaranteecpu`: sets the cpu guaranteed on a single workspace
- `quota-ws-maxcpu`: sets the cpu limit on a single workspace
- `quota-ws-guaranteemem`: sets the memory guaranteed on a single workspace in Gb
- `quota-ws-maxmem`:  sets the memory limit on a single workspace in Gb
- `quota-ws-storage-max`: set the storage dedicated to a single workspace in Gb
- `quota-storage-max`: sets the storage dedicated to the user data in Gb

In order to assign quotas need to modify the attributes from the keycloak admin con accounts.DOMAIN.

## Quotas assignment rules

The following rules are applied in order of priority
1. Quota value assigned directly to the user
2. Quota value assigned to a group directly assigned to the user
3. Quota value assigned to a parent group to a group assigned to the user. If more than one parent defines quotas, the lowest in the hierarchy is picked
4. Default value from deployment configurations in [workspaces](../applications/workspaces/deploy/values.yaml) and [hub](../applications/jupyterhub/deploy/values.yaml).