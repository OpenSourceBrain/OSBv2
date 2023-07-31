pkill -9 kubectl
kubectl port-forward --namespace $1 deployment/workspaces-postgres-host 5432:5432 &
kubectl port-forward --namespace $1 deployment/accounts 8080:8080 &
kubectl port-forward --namespace $1 statefulset/kafka 9092:9092 &
kubectl port-forward --namespace $1 deployment/argo-$1-server 2746:2746 &
