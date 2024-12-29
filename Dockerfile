# ベースイメージ
FROM rust:latest AS base

# 環境変数の設定 
ENV LANG=ja_JP.UTF-8 
ENV LC_ALL=ja_JP.UTF-8

# 必要なパッケージのインストールとロケールの設定 
ENV DEBIAN_FRONTEND=noninteractive 

# 必要なパッケージのインストールとロケールの設定
RUN apt-get update && apt-get install -y locales && \
    sed -i '/ja_JP.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=ja_JP.UTF-8 LC_ALL=ja_JP.UTF-8 && \
    echo "LANG=ja_JP.UTF-8" > /etc/default/locale && \
    echo "LC_ALL=ja_JP.UTF-8" >> /etc/default/locale

RUN apt-get install -y dialog

# ロケールの確認 
RUN locale

# ビルド時に指定可能な引数を定義
ARG USERNAME=developer
ARG GROUPNAME=developer
ARG UID=1000
ARG GID=1000
ARG PASSWORD=passy

# RUN apt-get update && apt-get install -y software-properties-common
# RUN add-apt-repository -y "deb http://gb.archive.ubuntu.com/ubuntu jammy main"
RUN apt-get update && apt-get install -y \
    file \
    libxdo-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    sqlite3 \
    libsqlite3-dev \
    libjavascriptcoregtk-4.1-dev \
    libsoup-3.0-dev \
    libwebkit2gtk-4.1-dev

# OpenGLのライブラリをインストール 
RUN apt-get install -y mesa-utils libgl1-mesa-glx libgl1-mesa-dri

# ソフトウェアレンダリングを強制
ENV LIBGL_ALWAYS_SOFTWARE=1  

RUN apt-get update -y && apt-get install -y sudo && \
    groupadd -g $GID $GROUPNAME && \
    useradd -m -s /bin/bash -u $UID -g $GID -G sudo $USERNAME && \
    echo $USERNAME:$PASSWORD | chpasswd && \
    echo "$USERNAME   ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Node.jsとYarnのインストール
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get update && apt-get install -y nodejs
# RUN apt-get install -y npm
RUN npm install -g yarn

# JAVAのインストール
RUN apt install openjdk-17-jdk -y

# ビルドステージ
FROM base AS builder
RUN cargo install tauri-cli

# SQLiteのインストール
RUN cargo add sqlx --features 'runtime-tokio-rustls, sqlite, migrate' 
RUN cargo add tokio --features full
RUN cargo add features
RUN cargo add directories


# 最終ステージ
FROM base AS final
# COPY --from=builder /usr/local/cargo/bin/cargo-tauri /usr/local/bin/cargo-tauri
# ENV PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig
WORKDIR /app

# RUN apt install libwebkit2gtk-4.1-dev
# COPY ./tauri/package.json ./tauri/yarn.lock ./
# COPY ./tauri .
