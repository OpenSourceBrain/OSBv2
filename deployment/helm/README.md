# CloudHarness Helm chart: deploy CloudHarness to k8s

Helm is used to define the CloudHarness deployment on Kubernetes. For further information about Helm, see https://helm.sh.

## Before starting

### Prerequisites

#### Kubectl

The Kubernetes shell (`kubectl`) must be installed and configured on the deployment cluster.
Possible alternatives are a google cloud provider or Minikube (for testing).

To install kubectl with google cloud, see https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl

#### Helm

A helm chart is used to perform the installation of your CloudHarness deployment on the cluster.
To install helm, see https://helm.sh/docs/intro/install.

With snap:
```bash
snap install helm --classic
helm init --wait
```

### If planning to use cloud provider

* cert-manager and nginx-ingress charts should be installed in the cluster.

### If planning to use minikube (run only once)

For the first run, specify a fair amount of cpus (>=4) and ram (>=5000mb)

```
minikube start --disk-size="120000mb" --cpus=4 --memory="5000mb"
```

If not installed, add the ingress addon to minikube:
`minikube addons enable ingress`

* Adding local volume

```bash
alias miniku=helm
```

NOTE: start minikube using the alias

* Adding domains to local host

```bash
sudo echo "$(minikube ip) [DOMAIN] airflow.[DOMAIN] keycloak.[DOMAIN] api.[DOMAIN] mapper.[DOMAIN] docs.[DOMAIN] neo4j.[DOMAIN] atlas.[DOMAIN] database.[DOMAIN] " >> /etc/hosts
```

NOTE: wildcard don't work.

* Create (or get) a trusted *.pem certificate for your machine and put inside `./certs`
  * macos -> `Keychain Access` > `Trust` > `Always trust`
  * linux ->

```bash
  cp ./certs/mycert.pem /usr/local/share/ca-certificates/extra/cacert.crt
  update-ca-certificates --verbose
  cat /usr/local/share/ca-certificates/extra/cacert.crt >> /usr/local/lib/python3.7/site-packages/certifi/cacert.pem
```

NOTE: Some python packages (such as certifi) have their own list of trusted CA. You might or might not need to perform the last step.

## Deployment

* Namespace (only once)

```bash
kubectl create namespace ch
```
(any namespace will do the job)

* Deploy

Use helm to install chart (this will install all CloudHarness applications in the cluster)

```bash
helm install ./ --name ch --namespace ch --set minikubeIp='$(minikube ip)'
```

* Update

```bash
helm upgrade cloudharness ./ --namespace ch  --install --force --reset-values minikubeIp='$(minikube ip)'
```

* List

```bash
helm ls
```

* Delete

```bash
helm del --purge ch
```

## Values

* `minikube`
  * (Boolean | true) Configures to deploy to minikube or cloud provider.
* `localIp`
  * (String | required) Configures to deploy to minikube or cloud provider.
* `domain`
  * Base domain
* `env`
  * Key value pairs inside `env` are copied to all containers
* `privenv`
  * These are opaque secrets transfered to container env variables during spawning.
  (Don't push them to GitHub)

## Debug Chart

* `--dry-run --debug`
