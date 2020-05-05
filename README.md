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

### Install and upgrade with Helm

1. Create the namespace `kubectl create ns osb2`
1. Create the namespace `kubectl create ns argo-workflows`
1. Run  `helm install osb2 deployment/helm  --namespace osb2` to install.

To upgrade an existing deployment, use:

```
helm upgrade osb2 deployment/helm --namespace osb2 --install --force --reset-values
```

## Development setup

Minikube is recommended to setup locally. The procedure is different depending on where Minikube is installed.
The simplest procedure is with Minikube hosted in the same machine where running the commands.


### Initialize Minikube cluster

At least 6GB of ram and 4 processors are needed to run MNP

To create a new cluster, run
```
minikube start --memory="6000mb" --cpus=4
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






