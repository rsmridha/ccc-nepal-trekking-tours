#!/usr/bin/env bash
set -euo pipefail

# Namecheap cPanel / SSH Automated Deployment Script for trekking.codeconceptconsulting.com
CPANEL_HOST="${CPANEL_HOST:-198.54.114.248}"
SSH_PORT="${SSH_PORT:-21098}"
SUBDOMAIN="${SUBDOMAIN:-trekking.codeconceptconsulting.com}"
REPO_URL="https://github.com/rsmridha/ccc-nepal-trekking-tours.git"

if [[ -z "${CPANEL_USER:-}" || -z "${CPANEL_PASS:-}" ]]; then
  echo "Error: CPANEL_USER and CPANEL_PASS must be set."
  exit 1
fi

echo "==> 1. Detecting document root for $SUBDOMAIN on $CPANEL_HOST..."
DOCROOT=$(curl -sk -u "$CPANEL_USER:$CPANEL_PASS" \
  "https://$CPANEL_HOST:2083/execute/DomainInfo/single_domain_data?domain=$SUBDOMAIN" \
  | grep -o '"documentroot":"[^"]*"' | head -n1 | cut -d'"' -f4 | sed 's/\\\//\//g' || true)

if [[ -z "$DOCROOT" ]]; then
  DOCROOT="/home/$CPANEL_USER/$SUBDOMAIN"
fi
echo "==> Document Root: $DOCROOT"

echo "==> 2. Cloning / Updating GitHub repository via cPanel UAPI VersionControl..."
curl -sk -u "$CPANEL_USER:$CPANEL_PASS" \
  --data-urlencode "type=git" \
  --data-urlencode "name=ccc-nepal-trekking-tours" \
  --data-urlencode "repository_root=$DOCROOT" \
  --data-urlencode "source_repository={\"remote_name\":\"origin\",\"url\":\"$REPO_URL\"}" \
  "https://$CPANEL_HOST:2083/execute/VersionControl/create" || true

curl -sk -u "$CPANEL_USER:$CPANEL_PASS" \
  --data-urlencode "repository_root=$DOCROOT" \
  --data-urlencode "branch=main" \
  "https://$CPANEL_HOST:2083/execute/VersionControl/update" || true

curl -sk -u "$CPANEL_USER:$CPANEL_PASS" \
  --data-urlencode "repository_root=$DOCROOT" \
  "https://$CPANEL_HOST:2083/execute/VersionControlDeployment/create" || true

echo "==> 3. Deployment triggered on $SUBDOMAIN ($DOCROOT)!"
