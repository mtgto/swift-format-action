FROM --platform=linux/amd64 ghcr.io/mtgto/swift-format:6.2 AS swift-format

FROM --platform=linux/amd64 debian:bookworm-slim
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*
COPY --from=swift-format /usr/bin/swift-format /usr/bin/swift-format
COPY --from=swift-format /etc/LICENSE.txt /etc/LICENSE.txt
COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
