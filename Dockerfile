FROM swift:5.3-focal

WORKDIR /swift-format
RUN apt-get update
RUN apt-get install wget
RUN wget -q -O - https://github.com/apple/swift-format/archive/0.50300.0.tar.gz | tar zxf - --strip-components 1
RUN swift build --configuration release

FROM swift:5.3-focal-slim
RUN apt-get update && apt-get install libz3-4
COPY --from=0 /swift-format/.build/x86_64-unknown-linux-gnu/release/swift-format /usr/bin
COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
