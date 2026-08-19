# Palm Breeze Mold, built and served as a container for Cloud Run.
#
# WHY A CONTAINER for a static site. The two client sites we already run are
# Cloud Run services, and scripts/cutover-status.ts reads Cloud Run domain
# mappings to answer "where is this switchover". Hosting this one on Firebase or
# a bucket would work and would also make it the one client that tool cannot
# see. Consistency with the operations tooling is worth more than the shorter
# path the README suggests.
#
# NO HEREDOCS. `COPY <<'EOF'` is BuildKit syntax; Cloud Build's legacy builder
# parses it as instructions and fails with "unknown instruction: SERVER". The
# server config is nginx.conf, copied in the ordinary way.

FROM node:20-alpine AS build
WORKDIR /app
# The generator is plain Node with no dependencies, so there is nothing to
# install: copying the source and running the build is the whole step.
COPY . .
RUN node build.mjs

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run routes to $PORT, which is 8080. nginx:alpine ships a default server
# on 80, so it is replaced rather than added to.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/site.conf

EXPOSE 8080
