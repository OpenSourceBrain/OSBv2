# OSBv2

An updated version of the Open Source Brain platform

## Deploy

### Prerequisites

The OSB deployment is built on top of [CloudHarness](https://github.com/MetaCell/cloud-harness).
The deployment process is based on Python 3.7+ scripts. It is recommended to setup a virtual 
environment first.

With conda: 
```bash
conda create --name osb python=3.7
conda activate osb
```

To install CloudHarness:

```
git clone https://github.com/MetaCell/cloud-harness.git
cd cloud-harness
pip install -r requirements.txt
```

### Create deployment

CloudHarness scripts script automate the deployment process.

To update the Codefresh deployment, run:

```
harness-codefresh .
```

To manually create the helm chart to use on any Kubernetes deployment, run:

```
harness-deployment cloud-harness . 
```
### Cluster setup
The cert-manager must be installed in order to use letsencrypt generated certificates

To check if cert-manager is installed, run:
```
kubectl get pods -n cert-manager
```
If cert manager is installed, the command will return 3 lines.

To install the cert manager on a new cluster, run:
```
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.1/cert-manager-legacy.yaml
```

See also https://cert-manager.io/docs/installation/kubernetes/.


### Install and upgrade with Helm

1. Create the namespace `kubectl create ns osb2`
1. Create the namespace `kubectl create ns argo-workflows`

1. Run  `helm install osb2 deployment/helm  --namespace osb2` to install.
1. Run `kubectl create rolebinding osb-admin-default --clusterrole=admin --serviceaccount=osb2:default -n osb2` to allow workflows to run on namespace osb2

To upgrade an existing deployment, use:

```
helm upgrade osb2 deployment/helm --namespace osb2 --install --reset-values [--force]
```

### Install Argo (temporary)

Argo is not yet part of the helm chart (issue https://github.com/MetaCell/mnp/issues/31)

In order to install it in the cluster, run

```
kubectl create ns argo
kubectl apply -n argo -f https://raw.githubusercontent.com/argoproj/argo/v2.4.3/manifests/install.yaml
kubectl create rolebinding argo-workflows-default --clusterrole=admin --serviceaccount=argo-workflows:default -n argo-workflows
kubectl create rolebinding argo-workflows --clusterrole=admin --serviceaccount=argo-workflows:argo-workflows -n argo-workflows
```

## Development setup

Minikube is recommended to setup locally. The procedure is different depending on where Minikube is installed.
The simplest procedure is with Minikube hosted in the same machine where running the commands.


### Initialize Minikube cluster

At least 6GB of ram and 4 processors are needed to run MNP

To create a new cluster, run
```
minikube start --memory="6000mb" --cpus=4 --disk-size=60000mb
```

Enable the ingress addon:

```
minikube addons enable ingress
```

### Minikube on the host machine

Connect your docker registry with minikube with:
`eval $(minikube docker-env)`

Then run:
```
harness-deployment cloud-harness . -l -b -d osb.local
```

### Minikube on a different machine

With the registry on localhost:5000 run:
```
harness-deployment cloud-harness . -l -r localhost:5000 -b -d osb.local
```

See below to learn how to configure Minikube and forward the registry.

#### Setup kubectl

If Minikube is installed in a different machine, the following procedure will allow to connect kubectl.

1. Install kubectl in the client machine
1. copy `~/.minikube` from the client to the server (skip cache and machines)
1. Copy `~/.kube/config` from the Minikube server to the client machine (make a backup of the previous version) and adjust paths to match the home folder on the client machine

##### Kube configuration copy

If you don't want to replace the whole content of the configuration you can copy only
 the relevant entries in `~/.kube/config` from the server to the client on `clusters`, `context`

Examples:

On `clusters`
```yaml
- cluster:
    certificate-authority: /home/user/.minikube/ca.crt
    server: https://192.168.99.106:8443
  name: minikube
```

On `context`
```yaml
- context:
    cluster: minikube
    user: minikube
  name: minikube
```

On `users`
```yaml
- name: minikube
  user:
    client-certificate: /home/user/.minikube/client.crt
    client-key: /home/user/.minikube/client.key
```

Set default context:
```yaml
current-context: minikube
```

#### Set up the Docker registry

In the case we are not building from the same machine as the cluster (which will always happen without Minikube),
we need a way to share the registry.

Procedure to share localhost:5000 from a kube cluster

In the minikube installation:

```bash
minikube addons enable registry
```

In the machine running the infrastructure-generate script, run

```bash
kubectl port-forward --namespace kube-system $(kubectl get po -n kube-system --field-selector=status.phase=Running | grep registry | grep -v proxy | \awk '{print $1;}') 5000:5000
```
