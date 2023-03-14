echo "🔨 Building image 📦";

docker-compose --env-file $ROUTE_ENV \
    $PWD/../docker-compose.yml \    
    up 