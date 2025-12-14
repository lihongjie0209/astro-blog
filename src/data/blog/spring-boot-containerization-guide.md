---
title: "Spring Boot 与容器化：构建、测试与运行全指南"
author: 李宏杰
pubDatetime: 2025-12-14T00:00:00Z
modDatetime: 2025-12-14T00:00:00Z
slug: spring-boot-containerization-guide
featured: true
draft: false
tags:
  - Spring Boot
  - Docker
  - Kubernetes
  - Testcontainers
  - Cloud Native
description: "全面介绍 Spring Boot 容器化最佳实践，涵盖 Cloud Native Buildpacks、Docker Compose 集成、Testcontainers 测试、Native Image 优化，以及 Kubernetes 生产环境部署的完整指南。基于 Spring I/O 2025 演讲内容。"
---

## Table of contents

## 演讲信息

**演讲者**: Matthias Haeussler & Eva Panadero  
**来源**: Spring I/O 2025  
**主题**: Spring Boot 与容器化全流程

本文档详细介绍了 Spring Boot 生态系统中与容器相关的最新特性和最佳实践，涵盖了从镜像构建、本地开发体验 (Docker Compose)、集成测试 (Testcontainers) 到 Kubernetes 生产环境运行的全流程。

## 1. 构建阶段 (Build)

构建容器镜像主要有两种方式：编写 Dockerfile 或使用 Cloud Native Buildpacks。此外，Native Image 也是提升容器性能的重要选项。

### 1.1 传统 Dockerfile 优化

如果选择手动编写 Dockerfile，建议利用**分层（Layering）机制**来优化镜像构建速度和缓存利用率。

**分层策略**: 
- 将不常变化的依赖（dependencies）放在底层
- 将经常变化的业务代码（application）放在顶层

**工具**: 使用 `jlink` 和 `jdeps` 可以构建裁剪版的 JRE，从而减小镜像体积并降低攻击面。

### 1.2 Cloud Native Buildpacks

Spring Boot 提供了对 Buildpacks 的原生支持，无需编写 Dockerfile 即可生成生产级镜像。

**优势**: 
- 自动化、标准化
- 不仅限于 Java

**命令**:

```bash
# 使用 Maven 插件构建
mvn spring-boot:build-image

# 或者使用 pack CLI
pack build my-app --builder paketobuildpacks/builder:base
```

### 1.3 Native Images (GraalVM)

Native Image 将 Java 应用编译为独立的二进制文件，无需 JVM 即可运行。

**优势**:
- **极速启动**: 从 JVM 的 ~1秒 缩短至 ~0.06秒
- **低内存占用**: 显著减少内存消耗
- **小体积**: 基础镜像体积更小（演示中从 261MB 降至 114MB）

**构建方式**:

```bash
mvn -Pnative spring-boot:build-image
```

**场景**: 非常适合 Serverless 或需要快速扩缩容的 Kubernetes 环境。

## 2. 开发体验 (Development)

### 2.1 Docker Compose 集成

Spring Boot 3.1+ 引入了 `spring-boot-docker-compose` 模块，极大地简化了本地开发。

**核心功能**:
- 应用启动时自动运行 `docker-compose.yaml` 中定义的服务（如 PostgreSQL）
- **自动服务发现与注入**: 自动检测容器的端口和凭据，并将其注入到 Spring Boot 的 `application.properties` 中
- 你不需要手动配置 `spring.datasource.url` 等属性

**依赖配置**:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-docker-compose</artifactId>
    <optional>true</optional>
</dependency>
```

### 2.2 Dev Containers

为了统一团队的开发环境，可以使用 **Dev Containers** (`devcontainer.json`)。

它允许你在容器中定义开发环境（JDK 版本、Maven/Gradle、CLI 工具、IDE 插件等）。

**支持**: VS Code, IntelliJ IDEA, GitHub Codespaces

**优势**: 消除 "在我机器上能跑" 的问题，实现**环境即代码**。

## 3. 测试与本地运行 (Testing)

### 3.1 Testcontainers 增强

Testcontainers 是集成测试的标准工具。Spring Boot 3.1+ 引入了 `@ServiceConnection`，简化了容器配置。

**旧方式**: 需要手动获取容器的 host 和 port，并设置到 Spring 属性中 (`@DynamicPropertySource`)。

**新方式** (`@ServiceConnection`): 自动管理连接信息的注入。

```java
@TestConfiguration(proxyBeanMethods = false)
public class TestContainersConfig {

    @Bean
    @ServiceConnection // 自动注入 Datasource 连接信息
    PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>("postgres:latest");
    }
}
```

### 3.2 spring-boot:test-run

这是一个非常有用的 Maven Goal。它允许你在本地运行主应用程序，同时利用 `TestConfiguration` 中定义的 Testcontainers 来启动依赖服务（如 DB）。

**命令**: 

```bash
mvn spring-boot:test-run
```

**效果**: 
- 启动应用 + 自动启动 Docker 容器（DB, Kafka 等）并连接
- 无需手动安装本地数据库

### 3.3 本地 AI 模型 (Local LLMs)

结合 Testcontainers 和 Docker Model Runner（或 Ollama），可以在本地容器中运行大语言模型（LLM），用于 Spring AI 应用的开发和测试。

## 4. 生产与 Kubernetes (Production)

### 4.1 Liveness & Readiness Probes

Spring Boot Actuator 内置了对 Kubernetes 探针的原生支持，无需额外配置。

- **Liveness (存活探针)**: `/actuator/health/liveness`
  - 如果失败，K8s 会重启 Pod
  
- **Readiness (就绪探针)**: `/actuator/health/readiness`
  - 如果失败，K8s 会停止向该 Pod 发送流量

### 4.2 优雅停机与生命周期

Actuator 可以通过配置模拟探针失败（例如 DOWN 状态），用于测试 Kubernetes 的自我修复能力（重启或切断流量）。

## 5. 总结流程图

```mermaid
graph TD
    subgraph Build
        Code[源代码] -->|Buildpacks| Image[容器镜像]
        Code -->|Native Build Tools| NativeBin[Native Binary]
        NativeBin --> NativeImage[Native Image]
    end

    subgraph Development
        ComposeFile[docker-compose.yaml] -->|spring-boot-docker-compose| AppDev[应用 自动连接]
        DevContainer[devcontainer.json] -->|IDE/Codespaces| DevEnv[统一开发环境]
    end

    subgraph Testing
        TestCode[测试代码] -->|@ServiceConnection| TestContainer[测试容器 DB/MQ]
        LocalRun[mvn spring-boot:test-run] -->|复用 TestConfig| LocalApp[本地运行的应用]
    end

    subgraph Production
        K8s[Kubernetes] -->|HTTP GET| Liveness[/actuator/health/liveness]
        K8s -->|HTTP GET| Readiness[/actuator/health/readiness]
    end
```

## 6. 关键要点 (Key Takeaways)

### 构建
- 优先使用 **Buildpacks**，除非有特殊需求才写 Dockerfile
- 考虑 **Native Image** 以获得极致性能

### 开发
- 使用 **Docker Compose 模块**消除本地配置文件的硬编码

### 测试
- 利用 **Testcontainers** 和 `@ServiceConnection` 简化集成测试
- 使用 `test-run` 进行本地全栈开发

### 运维
- 利用 **Actuator** 的原生探针与 Kubernetes 紧密集成
