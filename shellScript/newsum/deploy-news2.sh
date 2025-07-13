#!/bin/bash
NAMESPACE="site"
DEPLOY_NAME="news-deploy"
CONFIG_NAME="nodejs-db-config"
IMAGE="bbin99/newsum"
PORT=443
echo ":렌치: [$NAMESPACE] 네임스페이스 존재 확인 또는 생성"
kubectl get ns $NAMESPACE >/dev/null 2>&1 || kubectl create ns $NAMESPACE
echo ":흰색_확인_표시: [1] ConfigMap 생성 (없으면)"
kubectl get configmap $CONFIG_NAME -n $NAMESPACE >/dev/null 2>&1 || \
kubectl create configmap $CONFIG_NAME \
  --from-literal=DB_HOST=mysql-service \
  --from-literal=DB_NAME=news_db \
  --from-literal=DB_USER=nsuser \
  --from-literal=DB_PASSWORD=newsum \
  -n $NAMESPACE
echo ":흰색_확인_표시: [2] Deployment YAML 생성 및 적용"
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $DEPLOY_NAME
  namespace: $NAMESPACE
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $DEPLOY_NAME
  template:
    metadata:
      labels:
        app: $DEPLOY_NAME
    spec:
      containers:
        - name: $DEPLOY_NAME
          image: $IMAGE
          imagePullPolicy: Always
          ports:
            - containerPort: $PORT
          envFrom:
            - configMapRef:
                name: $CONFIG_NAME
          volumeMounts:
            - name: cert-volume
              mountPath: /app/certs
              readOnly: true
          resources:
            requests:
              cpu: "200m"
	      memory: "256Mi"
            limits:
              cpu: "500m"
	      memory: "512Mi"
      volumes:
        - name: cert-volume
          hostPath:
            path: /newsum/certs
            type: Directory
EOF
echo ":흰색_확인_표시: [3] LoadBalancer Service 생성"
kubectl expose deployment $DEPLOY_NAME \
  --type=LoadBalancer \
  --port=$PORT \
  --target-port=$PORT \
  --name=$DEPLOY_NAME \
  -n $NAMESPACE
echo ":흰색_확인_표시: [4] HorizontalPodAutoscaler(HPA) 생성"
kubectl autoscale deployment $DEPLOY_NAME \
  --cpu-percent=50 \
  --min=1 \
  --max=4 \
  -n $NAMESPACE
echo ":짠: HTTPS Node.js 앱 배포 + LoadBalancer + HPA 구성 완료!"
