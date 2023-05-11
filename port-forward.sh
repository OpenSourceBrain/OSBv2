killall -9 kubectl
kubectl port-forward --namespace $1 $(kubectl get po -n $1 --field-selector=status.phase==Running | grep workspaces-postgres-host | \awk '{print $1;}') 5432:5432 &
kubectl port-forward --namespace $1 $(kubectl get po -n $1 | grep accounts | \awk '{print $1;}') 8080:8080 &
kubectl port-forward --namespace $1 $(kubectl get po -n $1 | grep kafka | \awk '{print $1;}') 9092:9092 &
kubectl port-forward --namespace $1 $(kubectl get po -n $1 | grep argo-$1-server | \awk '{print $1;}') 2746:2746 &
