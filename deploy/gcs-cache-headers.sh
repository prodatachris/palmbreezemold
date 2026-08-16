#!/usr/bin/env bash
# Apply the caching policy from public/_headers to a Google Cloud Storage bucket.
#
#   ./deploy/gcs-cache-headers.sh gs://your-bucket-name
#
# WHY THIS EXISTS
# _headers is a Netlify/Cloudflare Pages format. Nothing on Google Cloud reads
# it. Copy dist/ to a bucket and every asset is served with whatever default
# Cache-Control the bucket has (usually `public, max-age=3600`), so the fonts and
# hero video that were meant to be cached for a year are refetched hourly. The
# file looks like the caching is handled. On this host it is not.
#
# WHAT THIS DOES NOT DO
# Object metadata can only carry a handful of response headers. The security
# headers in _headers — X-Content-Type-Options, Referrer-Policy, X-Frame-Options
# — cannot be set this way on GCS. They need either Firebase Hosting or a Cloud
# Load Balancer with a custom response-headers policy in front of the bucket.
# See the Deploying section of README.md. Do not assume they are in place
# because this script ran.
#
# Run after every deploy: setmeta applies to objects that exist now, not to
# objects uploaded later.

set -euo pipefail
BUCKET="${1:?usage: $0 gs://bucket-name}"

YEAR="public, max-age=31536000, immutable"
HOUR="public, max-age=3600"

echo "Fonts and assets are content-addressed by name and never change:"
gsutil -m setmeta -h "Cache-Control:$YEAR" "$BUCKET/fonts/**" || true
gsutil -m setmeta -h "Cache-Control:$YEAR" "$BUCKET/assets/**" || true

echo "styles.css and site.js are not content-hashed, so they get a short TTL:"
gsutil setmeta -h "Cache-Control:$HOUR" "$BUCKET/styles.css"
gsutil setmeta -h "Cache-Control:$HOUR" "$BUCKET/site.js"

echo "HTML must revalidate so a content change is visible immediately:"
gsutil -m setmeta -h "Cache-Control:public, max-age=0, must-revalidate" "$BUCKET/**/*.html" || true

echo "Done. Verify one object:"
echo "  gsutil stat $BUCKET/styles.css | grep -i cache"
