killall -9 kubectl
kubectl port-forward --namespace osb2dev $(kubectl get po -n osb2dev --field-selector=status.phase==Running | grep workspaces-postgres-host | \awk '{print $1;}') 5432:5432 &
kubectl port-forward --namespace osb2dev $(kubectl get po -n osb2dev | grep accounts | \awk '{print $1;}') 8080:8080 &
kubectl port-forward --namespace osb2dev $(kubectl get po -n osb2dev | grep kafka | \awk '{print $1;}') 9092:9092 &
kubectl port-forward --namespace osb2dev $(kubectl get po -n osb2dev | grep argo-osb2dev-server | \awk '{print $1;}') 2746:2746 &
