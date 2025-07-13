#!/bin/bash

NAMESPACE="site"

# 네임스페이스 생성 (있으면 무시)
kubectl get ns $NAMESPACE >/dev/null 2>&1 || kubectl create ns $NAMESPACE

echo "✅ [1] ConfigMap 생성"
kubectl create configmap nodejs-db-config \
  --from-literal=DB_HOST=mysql-service \
  --from-literal=DB_PORT=3306 \
  --from-literal=DB_NAME=news_db \
  --from-literal=DB_USER=root \
  -n $NAMESPACE

echo "✅ [2] Deployment 생성"
kubectl create deployment news-deploy \
  --image=younsu0117/my-node-web:v1 \
  -n $NAMESPACE \
  --dry-run=client -o yaml > temp-deploy.yaml

# Deployment YAML 수정: envFrom, containerPort, imagePullPolicy, resources 추가
cat <<EOF > temp-patch.yaml
spec:
  template:
    spec:
      containers:
      - name: news-deploy
        image: younsu0117/my-node-web:v1
        envFrom:
        - configMapRef:
            name: nodejs-db-config
        ports:
        - containerPort: 3000
        imagePullPolicy: Always
        resources:
          limits:
            cpu: "500m"
          requests:
            cpu: "200m"
EOF

# Patch Deployment with additional settings
kubectl patch --local -f temp-deploy.yaml --patch-file temp-patch.yaml -o yaml > final-deploy.yaml
kubectl apply -f final-deploy.yaml

echo "✅ [3] Service 생성"
kubectl expose deployment news-deploy \
  --type=NodePort \
  --port=3000 \
  --target-port=3000 \
  --name=news-deploy \
  -n $NAMESPACE

# NodePort 설정 강제로 30080으로 변경
kubectl patch service news-deploy -n $NAMESPACE --patch '{
  "spec": {
    "ports": [
      {
        "port": 3000,
        "targetPort": 3000,
        "protocol": "TCP",
        "nodePort": 30080
      }
    ]
  }
}'

echo "✅ [4] HPA 생성"
kubectl autoscale deployment news-deploy \
  --cpu-percent=50 \
  --min=3 \
  --max=10 \
  -n $NAMESPACE

echo "🎉 모든 리소스가 성공적으로 배포되었습니다!"

