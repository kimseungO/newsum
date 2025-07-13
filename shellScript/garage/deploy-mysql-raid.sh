#!/bin/bash

NAMESPACE="site"
NODE_NAME="worker2"
MOUNT_PATH="/mnt/raid10"
PV_NAME="raid-pv"
STORAGE_CLASS="local-storage"

echo "🔧 [$NAMESPACE] 네임스페이스 존재 확인 또는 생성"
kubectl get ns $NAMESPACE >/dev/null 2>&1 || kubectl create ns $NAMESPACE

echo "✅ [1] StorageClass 생성"
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: $STORAGE_CLASS
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
EOF

echo "✅ [2] ConfigMap 생성"
kubectl create configmap configmap-env \
  --from-literal=DB_HOST=mysql-service \
  --from-literal=DB_NAME=news_db \
  --from-literal=DB_USER=nsuser \
  --from-literal=DB_PASSWORD=newsum \
  -n $NAMESPACE

echo "✅ [3] PersistentVolume 생성"
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolume
metadata:
  name: $PV_NAME
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: $STORAGE_CLASS
  local:
    path: $MOUNT_PATH
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - $NODE_NAME
EOF

echo "✅ [4] StatefulSet 생성"
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-service
  namespace: $NAMESPACE
spec:
  serviceName: mysql-service
  replicas: 1
  selector:
    matchLabels:
      app: mysql-service
  template:
    metadata:
      labels:
        app: mysql-service
    spec:
      nodeSelector:
        kubernetes.io/hostname: $NODE_NAME
      containers:
      - name: mysql-service
        image: mysql:8.0
        envFrom:
          - configMapRef:
              name: configmap-env
        ports:
        - name: mysql
          containerPort: 3306
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes:
        - ReadWriteOnce
      storageClassName: $STORAGE_CLASS
      resources:
        requests:
          storage: 10Gi
EOF

echo "✅ [5] Service 생성"
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
  namespace: $NAMESPACE
spec:
  type: ClusterIP
  selector:
    app: mysql-service
  ports:
  - protocol: TCP
    port: 3306
    targetPort: 3306
EOF

echo "🎉 모든 MySQL 관련 리소스가 성공적으로 생성되었습니다!"

