#!/bin/bash

# Copyright 2025 OSBv2 contributors
# Author: Ankur Sinha <sanjay DOT ankur AT gmail DOT com>
# File : osbv2-local.sh
#
# Script to help with local deployments of OSBv2
# To be executed from the root folder of the OSBv2 repository.

# depends on how you install it, by default in the parent folder from where
# this script is called
CLOUD_HARNESS_URL="https://github.com/MetaCell/cloud-harness.git"
CLOUD_HARNESS_DIR_LOCATION="../"
CLOUD_HARNESS_DIR="${CLOUD_HARNESS_DIR_LOCATION}/cloud-harness"
CLOUD_HARNESS_DEFAULT="develop"
CLOUD_HARNESS_BRANCH=""
SKAFFOLD="skaffold"
SKAFFOLD_MAX_VERSION="2.14.2"

# Application to deploy
DEPLOYMENT_APP=""
DEFAULT_DEPLOYMENT_APP="osb-portal"

# Py version
# Cloud harness doesn't always work on newer versions
PY_VERSION="python3.12"
#
# if not, specify location of virtualenv here
OSB_DIR="./"
VENV_DIR="${OSB_DIR}/.venv"

LIVE_TAG="0.8.0"
OSB_NAMESPACE="osblocal"
LIVE="NO"

# Resources
CPUS=8
MEMORY="10000mb"
if [[ "$CI" == "true" ]]; then
    # if running in GHA, use 4 CPUs
    CPUS=4
    MEMORY="10000mb"
fi

# https://stackoverflow.com/a/37939589/375067
get_version () { echo "$@" | awk -F. '{ printf("%d%03d%03d%03d\n", $1,$2,$3,$4); }'; }


start_minikube () {
    echo "-> checking (and starting) docker daemon"
    if [[ "$(uname -s)" == "Linux" ]]; then
        systemctl is-active docker --quiet || sudo systemctl start docker.service
    else
        echo "🍏  Assuming Docker is already running on OS: $(uname -s)"
    fi

    echo "-> starting minikube"
    if minikube status
    then
        echo "-> Minikube is already running: not restarting it"
        echo "-> Please stop/delete it manually if  you want us to start a new minikube node"
    else
        minikube start --memory="$MEMORY" --cpus="$CPUS" --disk-size="60000mb" --kubernetes-version=v1.32 --driver=docker || notify_fail "Failed: minikube start"
        echo "-> enabling ingress addon"
        minikube addons enable ingress || notify_fail "Failed: ingress add on"
        minikube addons enable metrics-server || notify_fail "Failed: ingress add on"
        echo "-> setting up ${OSB_NAMESPACE} namespace"
        kubectl get ns ${OSB_NAMESPACE} || kubectl create ns ${OSB_NAMESPACE} || notify_fail "Failed: ns set up"
        kubectl config set-context --current --namespace=${OSB_NAMESPACE} || notify_fail "Failed: ns set up"
        echo "-> setting up minikube docker env"

    eval "$(minikube docker-env)" || notify_fail "Failed: env setup"
    fi
}

deploy_live () {
    if ! command -v helm >/dev/null || !  command -v harness-deployment  >/dev/null ; then
        echo "helm and cloud-harness are required but were not found."
        echo
        echo "Please install helm as noted in their documentation:"
        echo "- https://helm.sh/docs/intro/install/"
        echo
        echo "To install cloud-harness, please see the -u/-U options"
        exit 1
    fi

    LIVE="YES"

    pushd $OSB_DIR || exit 1
        echo "-> deploying live configuration"

        start_minikube

        harness_deployment

        echo
        echo
        echo "-> Deploying with helm: helm install -n ${OSB_NAMESPACE} osb deployment/helm"

        helm install -n ${OSB_NAMESPACE} osb deployment/helm

    popd || exit 1
}

show_deployment_status () {
    echo "-> Deployment status:"
    echo "-> minikube: minikube status"
    minikube status

    echo
    echo "-> pods: kubectl -n ${OSB_NAMESPACE} get pods"
    kubectl -n ${OSB_NAMESPACE} get pods

    echo
    echo "-> resource usage:"
    echo "-> kubectl -n ${OSB_NAMESPACE} top node"
    kubectl -n ${OSB_NAMESPACE} top node
    echo
    echo "-> kubectl -n ${OSB_NAMESPACE} top pods"
    kubectl -n ${OSB_NAMESPACE} top pods

    echo
    echo "-> For a graphical interface, try the minikube dashboard: 'minikube dashboard &'"
}

deploy () {
    if ! command -v helm >/dev/null || ! command -v $SKAFFOLD >/dev/null || !  command -v harness-deployment  >/dev/null ; then
        echo "helm, skaffold, and cloud-harness are required but were not found."
        echo
        echo "Please install helm and skaffold as noted in their documentation:"
        echo "- https://helm.sh/docs/intro/install/"
        echo "- https://skaffold.dev/docs/install/"
        echo
        echo "To install cloud-harness, please see the -u/-U options"
        exit 1
    fi

    skaffold_version="$($SKAFFOLD version)"

    if [ "$(get_version ${skaffold_version:1})" -gt "$(get_version $SKAFFOLD_MAX_VERSION)" ]
    then
        echo "-> Found Skaffold version: ${skaffold_version:1}"
        echo "-> Skaffold version <= ${SKAFFOLD_MAX_VERSION} is currently required"
        echo "-> Please install it from: https://github.com/GoogleContainerTools/skaffold/releases/tag/v${SKAFFOLD_MAX_VERSION}"
        echo "-> See: https://github.com/GoogleContainerTools/skaffold/issues/9788"
        exit 1
    fi

    pushd $OSB_DIR || exit 1
        echo "-> deploying"
        start_minikube

        harness_deployment

        echo "-> running skaffold"
        $SKAFFOLD dev --cleanup=false || { notify_fail "Failed: skaffold" ; minikube stop; }
        #$SKAFFOLD dev || notify_fail "Failed: skaffold"
    popd || exit 1
}

list_versions () {
    if !  command -v harness-deployment >/dev/null 2>&1 ; then
        echo "cloud-harness is required but were not found."
        echo "To install cloud-harness, please see the -u/-U options"
        exit 1
    fi

    harness_deployment

    HELM_FILE="./deployment/helm/values.yaml"

    echo
    echo
    echo "-> Versions of apps (from $HELM_FILE)"
    sed 's/^[ \t ]*//' $HELM_FILE | grep -i --color=auto "netpyne-ui.git"
    sed 's/^[ \t ]*//' $HELM_FILE | grep -i --color=auto "nwb-explorer.git"

    echo
    echo "-> JupyterLab: requirements"
    cat ./applications/jupyterlab/requirements.txt
    echo
    echo "-> JupyterLab: Dockerfile"
    grep -iE -C2 --color=auto "(pip|apt|conda).*install" ./applications/jupyterlab/Dockerfile

}

harness_deployment() {
    # `-e local` does not build nwbexplorer/netpyne
    # use -e dev for that, but that will send e-mails to Metacell folks
    # suggested: create a new file in deploy/values-something.yaml where you use
    # your e-mail address, and then use `-e something` to use these values.
    pushd $OSB_DIR || exit 1
        if [ "YES" == "$LIVE" ]
        then
            echo "-> harnessing live configuration deployment, and deploying"
            harness-deployment ../cloud-harness . -l -n ${OSB_NAMESPACE} -d osb.local -r gcr.io/metacellllc -e "local" -t "$LIVE_TAG" || notify_fail "Failed: harness-deployment (live)"
        else
            echo "-> harnessing development deployment"
            harness-deployment ../cloud-harness . -l  -n ${OSB_NAMESPACE} -d osb.local -dtls -e "local" ${DEPLOYMENT_APP:+-i $DEPLOYMENT_APP} || notify_fail "Failed: harness-deployment (dev)"
        fi
    popd || exit 1
}

notify_fail () {
    if ! command -v notify-send >/dev/null
    then
        echo "-> $1"
    else
        notify-send -t 1000 -i "org.gnome.Terminal" -a "Terminal" "OSBv2 deployment" "$1"
    fi
    exit 1
}

update_cloud_harness() {
    echo "Updating cloud harness"
    CLOUD_HARNESS_PACKAGES=$(pip list | grep cloud | tr -s " " | cut -d " " -f1 | tr '\n' ' ')
    pip uninstall "${CLOUD_HARNESS_PACKAGES}" -y || echo "No cloud harness packages installed"
    if ! [ -d "${CLOUD_HARNESS_DIR}" ]
    then
        echo "Cloud harness folder does not exist. Cloning"
        pushd "${CLOUD_HARNESS_DIR_LOCATION}" && git clone "${CLOUD_HARNESS_URL}" && popd || exit 1
    fi
    pushd "$CLOUD_HARNESS_DIR" && git clean -dfx && git fetch && git checkout "${CLOUD_HARNESS_BRANCH}" && git pull && pip install -r requirements.txt && popd || exit 1
}

activate_venv() {
    if [ -f "${VENV_DIR}/bin/activate" ]
    then
        source "${VENV_DIR}/bin/activate"
    else
        echo "No virtual environment found at ${VENV_DIR}. Creating"
        ${PY_VERSION} -m venv "${VENV_DIR}" && source "${VENV_DIR}/bin/activate"
    fi
}

# don't actually need this because when the script exists, the environment is
# lost anyway
deactivate_venv() {
    deactivate
}

print_versions() {
    echo "** docker **"
    docker version
    echo -e "\n** minikube **"
    minikube version
    echo -e "\n** cloud harness **"
    pushd "${CLOUD_HARNESS_DIR}" && git log --oneline | head -1 && popd || exit 1
    echo -e "\n** helm **"
    helm version
    echo -e "\n** skaffold **"
    $SKAFFOLD version
    echo -e "\n** python **"
    python --version
    echo -e "\n** git **"
    git --version
}

clean () {
    pushd $OSB_DIR || exit 1
        echo "-> Cleaning up all images."
        #docker image prune --all
        docker builder prune --all
        $SKAFFOLD delete
        minikube stop
        minikube delete
        #docker image prune --all
        docker builder prune --all
    popd || exit 1
}

usage () {
    echo "Script for automating local deployments of OSBv2"
    echo
    echo "USAGE $0 -[dDbBvuUchls]"
    echo
    echo "-d: deploy"
    echo "-D: deploy <app>"
    echo "-b: run 'harness-deployment': required when you have made changes and want to refresh the deployment"
    echo "    by default, runs on the 'osb-portal' app; use -B to not mention an app or to mention another app"
    echo "-B: run 'harness-deployment <app>': required when you have made changes and want to refresh the deployment"
    echo "    use an empty string \"\" to not specify an app"
    echo "-v: print version information"
    echo "-u branch: update and install provided cloud_harness branch ($CLOUD_HARNESS_DEFAULT)"
    echo "-U branch: update and install specified cloud_harness branch ($CLOUD_HARNESS_DEFAULT)"
    echo "-c: clean up minikube and docker: sometimes needed with an outdated cache"
    echo "-g: list versions of components (development deployment)"
    echo "-G: list versions of components (live deployment)"
    echo "-l: deploy a local deployment of the \"live\" configuration"
    echo "-s: show some status information about the deployment"
    echo "-h: print this and exit"
    echo
    echo "Note: remember to update your /etc/hosts file and forward the ports as shown in the harness-deployment output."
}

if [ $# -lt 1 ]
then
    usage
    exit 1
fi


# parse options
while getopts ":vdD:uU:hbB:clsgG" OPTION
do
    case $OPTION in
        v)
            activate_venv
            print_versions
            deactivate_venv
            exit 0
            ;;
        b)
            DEPLOYMENT_APP="${DEFAULT_DEPLOYMENT_APP}"
            activate_venv
            harness_deployment
            deactivate_venv
            exit 0
            ;;
        B)
            DEPLOYMENT_APP="${OPTARG}"
            activate_venv
            harness_deployment
            deactivate_venv
            exit 0
            ;;
        d)
            DEPLOYMENT_APP="${DEFAULT_DEPLOYMENT_APP}"
            activate_venv
            deploy
            exit 0
            ;;
        D)
            DEPLOYMENT_APP="${OPTARG}"
            activate_venv
            deploy
            exit 0
            ;;
        c)
            clean
            exit 0
            ;;
        u)
            CLOUD_HARNESS_BRANCH="${CLOUD_HARNESS_DEFAULT}"
            activate_venv
            update_cloud_harness
            deactivate_venv
            exit 0
            ;;
        U)
            CLOUD_HARNESS_BRANCH="${OPTARG}"
            activate_venv
            update_cloud_harness
            deactivate_venv
            exit 0
            ;;
        l)
            activate_venv
            deploy_live
            exit 0
            ;;
        s)
            show_deployment_status
            exit 0
            ;;
        g)
            DEPLOYMENT_APP=""
            list_versions
            exit 0
            ;;
        G)
            LIVE="YES"
            list_versions
            exit 0
            ;;
        h)
            usage
            exit 0
            ;;
        ?)
            usage
            exit 1
            ;;
    esac
done
