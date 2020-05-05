#!/bin/bash
set -e
set -x

[ -d /var/lib/zookeeper/data ] || mkdir /var/lib/zookeeper/data
[ -z "$ID_OFFSET" ] && ID_OFFSET=1
export ZOOKEEPER_SERVER_ID=$((${HOSTNAME##*-} + $ID_OFFSET))
echo "${ZOOKEEPER_SERVER_ID:-1}" | tee /var/lib/zookeeper/data/myid
cp -Lur /etc/kafka-configmap/* /etc/kafka/
[ ! -z "$PZOO_REPLICAS" ] && [ ! -z "$ZOO_REPLICAS" ] && {
  sed -i "s/^server\\./#server./" /etc/kafka/zookeeper.properties
  for N in $(seq $PZOO_REPLICAS); do echo "server.$N=pzoo-$(( $N - 1 )).pzoo:2888:3888:participant" >> /etc/kafka/zookeeper.properties; done
  for N in $(seq $ZOO_REPLICAS); do echo "server.$(( $PZOO_REPLICAS + $N ))=zoo-$(( $N - 1 )).zoo:2888:3888:participant" >> /etc/kafka/zookeeper.properties; done
}
sed -i "s/server\.$ZOOKEEPER_SERVER_ID\=[a-z0-9.-]*/server.$ZOOKEEPER_SERVER_ID=0.0.0.0/" /etc/kafka/zookeeper.properties
