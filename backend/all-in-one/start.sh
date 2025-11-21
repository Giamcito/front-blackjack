#!/usr/bin/env bash
set -euo pipefail

JAVA_OPTS=${JAVA_OPTS:-}
SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-dev}

echo "[all-in-one] Starting blackjack: java -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -Dserver.port=8082 -jar /app/blackjack.jar"
java $JAVA_OPTS -Dspring.profiles.active="$SPRING_PROFILES_ACTIVE" -Dserver.port=8082 -jar /app/blackjack.jar &
PID1=$!

echo "[all-in-one] Starting conteo:   java -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -Dserver.port=8083 -jar /app/conteo.jar"
java $JAVA_OPTS -Dspring.profiles.active="$SPRING_PROFILES_ACTIVE" -Dserver.port=8083 -jar /app/conteo.jar &
PID2=$!

echo "[all-in-one] Starting ruleta:   java -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -Dserver.port=8084 -jar /app/ruleta.jar"
java $JAVA_OPTS -Dspring.profiles.active="$SPRING_PROFILES_ACTIVE" -Dserver.port=8084 -jar /app/ruleta.jar &
PID3=$!

echo "[all-in-one] PIDs -> blackjack=$PID1 conteo=$PID2 ruleta=$PID3"

term() {
  echo "[all-in-one] Caught SIGTERM, stopping services..."
  kill -TERM "$PID1" "$PID2" "$PID3" 2>/dev/null || true
  wait || true
}
trap term SIGINT SIGTERM

# Wait until one exits
set +e
wait -n
code=$?
echo "[all-in-one] A service exited with code $code. Stopping the rest..."
kill -TERM "$PID1" "$PID2" "$PID3" 2>/dev/null || true
wait || true
exit $code
