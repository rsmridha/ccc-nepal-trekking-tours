#!/usr/bin/env bash
# Nomad & Noble Nepal - Instant Client Demo Tunnel
# Starts a secure, cost-free public HTTPS tunnel powered by Cloudflare

set -e

PORT=3200
echo "=========================================================="
echo "  Nomad & Noble Nepal - Live Client Demo Tunnel"
echo "=========================================================="
echo "Checking local application on port $PORT..."

if ! curl -s "http://localhost:$PORT" > /dev/null; then
  echo "Local server is not running on port $PORT. Starting dev server..."
  ./run.sh &
  sleep 4
fi

echo "Opening secure Cloudflare tunnel..."
echo "Share the generated trycloudflare.com HTTPS link with your client."
echo "Press Ctrl+C to close the demo tunnel at any time."
echo "=========================================================="

cloudflared tunnel --url "http://localhost:$PORT"
