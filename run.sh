#!/usr/bin/env bash
# ==============================================================================
# Nomad & Noble Nepal (NNN) - Background Service Manager (Port 3200)
# ==============================================================================
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$DIR/.app-3200.pid"
LOG_FILE="$DIR/.app-3200.log"
PORT=3200

get_pid() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
      echo "$PID"
      return 0
    fi
  fi
  # Fallback to check who is listening on PORT
  LSOF_PID=$(lsof -nP -iTCP:$PORT -sTCP:LISTEN -t 2>/dev/null | head -n 1)
  if [ -n "$LSOF_PID" ]; then
    echo "$LSOF_PID"
    return 0
  fi
  echo ""
}

start() {
  PID=$(get_pid)
  if [ -n "$PID" ]; then
    echo "[NNN] Server is already running on http://localhost:$PORT (PID: $PID)"
    return 0
  fi

  echo "[NNN] Starting Nomad & Noble Nepal on http://localhost:$PORT..."
  cd "$DIR" || exit 1
  nohup npm run dev > "$LOG_FILE" 2>&1 &
  NEW_PID=$!
  echo "$NEW_PID" > "$PID_FILE"
  sleep 2

  if ps -p "$NEW_PID" > /dev/null 2>&1; then
    echo " [NNN] Started successfully!"
    echo "  - URL:  http://localhost:$PORT"
    echo "  - PID:  $NEW_PID"
    echo "  - Logs: $LOG_FILE"
  else
    echo "❌ [NNN] Failed to start. Check $LOG_FILE"
  fi
}

stop() {
  PID=$(get_pid)
  if [ -z "$PID" ]; then
    echo "[NNN] No server currently running on port $PORT."
    rm -f "$PID_FILE"
    return 0
  fi

  echo "[NNN] Stopping process PID: $PID..."
  kill "$PID" 2>/dev/null
  # Also kill any process listening on port 3200
  lsof -nP -iTCP:$PORT -sTCP:LISTEN -t | xargs kill -9 2>/dev/null
  rm -f "$PID_FILE"
  echo " [NNN] Server stopped."
}

status() {
  PID=$(get_pid)
  if [ -n "$PID" ]; then
    echo " [NNN] Server is RUNNING on http://localhost:$PORT (PID: $PID)"
  else
    echo "○ [NNN] Server is STOPPED."
  fi
}

logs() {
  if [ -f "$LOG_FILE" ]; then
    tail -f "$LOG_FILE"
  else
    echo "No log file found at $LOG_FILE yet."
  fi
}

clean() {
  stop
  echo "[NNN] Clearing .next build cache..."
  rm -rf "$DIR/.next"
  echo " [NNN] Cache cleared."
  start
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    sleep 1
    start
    ;;
  clean)
    clean
    ;;
  status)
    status
    ;;
  logs)
    logs
    ;;
  *)
    echo "Usage: ./run.sh {start|stop|restart|clean|status|logs}"
    exit 1
    ;;
esac
