load('/home/user/OSBv2/cloud-harness/deployment-configuration/tilt-deploy.ext', 'deploy')
load('ext://uibutton', 'cmd_button')

config.define_bool('setup-infrastructure')
config.define_bool('watch')
cfg = config.parse()
setup_infrastructure = cfg.get('setup-infrastructure', False)
watch = cfg.get('watch', False)
if setup_infrastructure:
    # setup ingress
    print("Installing ingress controller")
    # local("cd infrastructure/cluster-configuration && source cluster-init.sh")
    local("kubectl get namespace ingress-nginx 2>/dev/null 1>/dev/null || bash -c 'helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace --version v4.2.5 --wait --wait-for-jobs'")
    # print("Let's wait a few seconds...")
    # local("sleep 30")
else:
    print("To setup the infrastructure (f.e. ingress controller)")
    print("run: tilt up -- --setup-infrastructure")

if not watch:
    print("To watch file changes, run: tilt up -- --watch")


# build images
docker_build(ref='osb/cloudharness-base', context='/home/user/OSBv2/cloud-harness', dockerfile='cloud-harness/infrastructure/base-images/cloudharness-base/Dockerfile', build_args={'DEBUG': ''})
docker_build(ref='osb/cloudharness-frontend-build', context='/home/user/OSBv2/cloud-harness', dockerfile='cloud-harness/infrastructure/base-images/cloudharness-frontend-build/Dockerfile', build_args={'DEBUG': ''})
docker_build(ref='osb/cloudharness-flask', context='/home/user/OSBv2/cloud-harness/infrastructure/common-images/cloudharness-flask', dockerfile='cloud-harness/infrastructure/common-images/cloudharness-flask/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'})
docker_build(ref='osb/notifications', context='/home/user/OSBv2/.overrides/applications/notifications/server', dockerfile='.overrides/applications/notifications/server/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'})
docker_build(ref='osb/accounts', context='/home/user/OSBv2/.overrides/applications/accounts', dockerfile='.overrides/applications/accounts/Dockerfile', build_args={'DEBUG': ''})
docker_build(ref='osb/jupyterhub', context='/home/user/OSBv2/.overrides/applications/jupyterhub', dockerfile='.overrides/applications/jupyterhub/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'})
docker_build(ref='osb/workflows-send-result-event', context='cloud-harness/applications/workflows/tasks/send-result-event', dockerfile='/home/user/OSBv2/cloud-harness/applications/workflows/tasks/send-result-event/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'}, match_in_env_vars=True)
docker_build(ref='osb/workflows-extract-download', context='cloud-harness/applications/workflows/tasks/extract-download', dockerfile='/home/user/OSBv2/cloud-harness/applications/workflows/tasks/extract-download/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'}, match_in_env_vars=True)
docker_build(ref='osb/workflows-notify-queue', context='cloud-harness/applications/workflows/tasks/notify-queue', dockerfile='/home/user/OSBv2/cloud-harness/applications/workflows/tasks/notify-queue/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'}, match_in_env_vars=True)
docker_build(ref='osb/workflows', context='/home/user/OSBv2/cloud-harness/applications/workflows/server', dockerfile='cloud-harness/applications/workflows/server/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_FLASK': 'osb/cloudharness-flask'})
docker_build(ref='osb/workspaces-biomodels-copy', context='applications/workspaces/tasks/biomodels-copy', dockerfile='/home/user/OSBv2/./applications/workspaces/tasks/biomodels-copy/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'}, match_in_env_vars=True)
docker_build(ref='osb/workspaces-figshare-copy', context='applications/workspaces/tasks/figshare-copy', dockerfile='/home/user/OSBv2/./applications/workspaces/tasks/figshare-copy/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'}, match_in_env_vars=True)
docker_build(ref='osb/workspaces-scan-workspace', context='applications/workspaces/tasks/scan-workspace', dockerfile='/home/user/OSBv2/./applications/workspaces/tasks/scan-workspace/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'}, match_in_env_vars=True)
docker_build(ref='osb/workspaces-github-copy', context='applications/workspaces/tasks/github-copy', dockerfile='/home/user/OSBv2/./applications/workspaces/tasks/github-copy/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_BASE': 'osb/cloudharness-base'}, match_in_env_vars=True)
docker_build(ref='osb/workspaces-dandi-copy', context='applications/workspaces/tasks/dandi-copy', dockerfile='/home/user/OSBv2/./applications/workspaces/tasks/dandi-copy/Dockerfile', build_args={'DEBUG': ''}, match_in_env_vars=True)
docker_build(ref='osb/workspaces', context='/home/user/OSBv2/./applications/workspaces/server', dockerfile='applications/workspaces/server/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_FLASK': 'osb/cloudharness-flask'})
docker_build(ref='osb/netpyne', context='/home/user/OSBv2/./applications/netpyne', dockerfile='applications/netpyne/Dockerfile', build_args={'DEBUG': ''})
docker_build(ref='osb/accounts-api', context='/home/user/OSBv2/./applications/accounts-api', dockerfile='applications/accounts-api/Dockerfile', build_args={'DEBUG': '', 'CLOUDHARNESS_FLASK': 'osb/cloudharness-flask'})
docker_build(ref='osb/osb-portal', context='/home/user/OSBv2/./applications/osb-portal', dockerfile='applications/osb-portal/Dockerfile', build_args={'DEBUG': ''})
docker_build(ref='osb/backoffice', context='/home/user/OSBv2/./applications/backoffice', dockerfile='applications/backoffice/Dockerfile', build_args={'DEBUG': ''})
docker_build(ref='osb/nwb-explorer', context='/home/user/OSBv2/./applications/nwb-explorer', dockerfile='applications/nwb-explorer/Dockerfile', build_args={'DEBUG': ''})
docker_build(ref='osb/jupyterlab', context='/home/user/OSBv2/./applications/jupyterlab', dockerfile='applications/jupyterlab/Dockerfile', build_args={'DEBUG': ''})


extra_env = {}
extra_env.setdefault("accounts", [])
extra_env.setdefault("workflows", [])
extra_env["workflows"].append("osb/workflows-send-result-event")
extra_env["workflows"].append("osb/workflows-extract-download")
extra_env["workflows"].append("osb/workflows-notify-queue")
extra_env.setdefault("workspaces", [])
extra_env["workspaces"].append("osb/workspaces-biomodels-copy")
extra_env["workspaces"].append("osb/workspaces-figshare-copy")
extra_env["workspaces"].append("osb/workspaces-scan-workspace")
extra_env["workspaces"].append("osb/workspaces-github-copy")
extra_env["workspaces"].append("osb/workspaces-dandi-copy")
extra_env.setdefault("api.accounts", [])
extra_env.setdefault("www", [])
extra_env.setdefault("admin", [])


# deploy
deploy(name='osb2', namespace='osb2', extra_env=extra_env, watch=watch)

# Add Tilt ui elements for: accounts
k8s_resource(
    'accounts',
    links=[link('http://accounts.v2.opensourcebrain.org', 'Open accounts page')]
)
cmd_button('accounts:set debug mode',
    argv=["sh", "-c", "kubectl -n osb2 patch deployment accounts --patch '{\"spec\": {\"template\": {\"spec\": {\"containers\": [{\"name\": \"accounts\", \"command\": [\"/bin/bash\"], \"args\": [\"-c\", \"sleep infinity\"], \"livenessProbe\": null, \"readinessProbe\": null}]}}}}'"],
    resource='accounts',
    icon_name='bug_report',
    text='set debug mode',
)
# Add Tilt ui elements for: workflows
k8s_resource(
    'workflows',
    links=[link('http://workflows.v2.opensourcebrain.org', 'Open workflows page')]
)
cmd_button('workflows:set debug mode',
    argv=["sh", "-c", "kubectl -n osb2 patch deployment workflows --patch '{\"spec\": {\"template\": {\"spec\": {\"containers\": [{\"name\": \"workflows\", \"command\": [\"/bin/bash\"], \"args\": [\"-c\", \"sleep infinity\"], \"livenessProbe\": null, \"readinessProbe\": null}]}}}}'"],
    resource='workflows',
    icon_name='bug_report',
    text='set debug mode',
)
# Add Tilt ui elements for: workspaces
k8s_resource(
    'workspaces',
    links=[link('http://workspaces.v2.opensourcebrain.org', 'Open workspaces page')]
)
cmd_button('workspaces:set debug mode',
    argv=["sh", "-c", "kubectl -n osb2 patch deployment workspaces --patch '{\"spec\": {\"template\": {\"spec\": {\"containers\": [{\"name\": \"workspaces\", \"command\": [\"/bin/bash\"], \"args\": [\"-c\", \"sleep infinity\"], \"livenessProbe\": null, \"readinessProbe\": null}]}}}}'"],
    resource='workspaces',
    icon_name='bug_report',
    text='set debug mode',
)
# Add Tilt ui elements for: api.accounts
k8s_resource(
    'accounts-api',
    links=[link('http://api.accounts.v2.opensourcebrain.org', 'Open api.accounts page')]
)
cmd_button('accounts-api:set debug mode',
    argv=["sh", "-c", "kubectl -n osb2 patch deployment accounts-api --patch '{\"spec\": {\"template\": {\"spec\": {\"containers\": [{\"name\": \"accounts-api\", \"command\": [\"/bin/bash\"], \"args\": [\"-c\", \"sleep infinity\"], \"livenessProbe\": null, \"readinessProbe\": null}]}}}}'"],
    resource='accounts-api',
    icon_name='bug_report',
    text='set debug mode',
)
# Add Tilt ui elements for: www
k8s_resource(
    'osb-portal',
    links=[link('http://www.v2.opensourcebrain.org', 'Open www page')]
)
cmd_button('osb-portal:set debug mode',
    argv=["sh", "-c", "kubectl -n osb2 patch deployment osb-portal --patch '{\"spec\": {\"template\": {\"spec\": {\"containers\": [{\"name\": \"osb-portal\", \"command\": [\"/bin/bash\"], \"args\": [\"-c\", \"sleep infinity\"], \"livenessProbe\": null, \"readinessProbe\": null}]}}}}'"],
    resource='osb-portal',
    icon_name='bug_report',
    text='set debug mode',
)
# Add Tilt ui elements for: admin
k8s_resource(
    'backoffice',
    links=[link('http://admin.v2.opensourcebrain.org', 'Open admin page')]
)
cmd_button('backoffice:set debug mode',
    argv=["sh", "-c", "kubectl -n osb2 patch deployment backoffice --patch '{\"spec\": {\"template\": {\"spec\": {\"containers\": [{\"name\": \"backoffice\", \"command\": [\"/bin/bash\"], \"args\": [\"-c\", \"sleep infinity\"], \"livenessProbe\": null, \"readinessProbe\": null}]}}}}'"],
    resource='backoffice',
    icon_name='bug_report',
    text='set debug mode',
)
