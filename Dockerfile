FROM --platform=linux/amd64 ghcr.io/mtgto/swift-format:6.4@sha256:334bf8f1d4a92c44d20afe20a54577e6c79002c431782c7c4d18c401f5246d08 AS swift-format

FROM --platform=linux/amd64 debian:trixie-slim@sha256:f6b08b09a05725f9431502d3b5714f5c4576e82c1a84fa1debe0c24a7e0c3ec4
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates git && \
    rm -rf /var/lib/apt/lists/* && \
    git config --system --add safe.directory /github/workspace
COPY --from=swift-format /usr/bin/swift-format /usr/bin/swift-format
COPY --from=swift-format /etc/LICENSE.txt /etc/LICENSE.txt
COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
