---
title: "Spring Boot Unwrapped: 3.x 系列最新特性探索"
author: 李宏杰
pubDatetime: 2025-12-14T00:00:00Z
modDatetime: 2025-12-14T00:00:00Z
slug: spring-boot-3-unwrapped-features
featured: true
draft: false
tags:
  - Spring Boot
  - Java
  - Observability
  - Virtual Threads
  - CDS
description: "深入探索 Spring Boot 3.2 至 3.4 版本的核心特性，涵盖结构化日志、虚拟线程、CDS 优化、现代化客户端 API、Actuator 增强及测试体验升级等方面的重大改进。基于 Devoxx 2025 演讲内容整理。"
---

## Table of contents

## 演讲信息

**演讲者**: Sergi Almar (Spring I/O 组织者)  
**来源**: Devoxx (2025年1月上传)  
**核心版本**: Spring Boot 3.2, 3.3, 3.4

本文档总结了 Spring Boot 3.x 系列（特别是 3.4）中引入的关键特性，涵盖了可观测性、效率、开发体验和测试等方面的重大改进。

## 1. 核心发布路线图

Spring Boot 保持每 6 个月发布一个次要版本的节奏：

- **Spring Boot 3.2** (2023.11): 基于 Spring Framework 6.1，引入虚拟线程、CRaC 支持。
- **Spring Boot 3.3** (2024.05): 重点在于 CDS (Class Data Sharing) 支持。
- **Spring Boot 3.4** (2024.11): 基于 Spring Framework 6.2，增强结构化日志、Bean 覆盖机制等。

## 2. 可观测性 (Observability)

Spring Boot 3.0 奠定了可观测性的基础，后续版本持续增强。

### 2.1 结构化日志 (Structured Logging) - Spring Boot 3.4 新特性

传统的文本日志对人类友好，但对机器解析不友好。Spring Boot 3.4 原生支持结构化日志（如 JSON 格式），方便 ELK、Splunk 等工具解析。

**支持格式**: 
- Elastic Common Schema (ECS)
- Graylog Extended Log Format (GELF)
- Logstash

**配置方式**:

```properties
logging.structured.format.console=ecs
logging.structured.format.file=logstash
```

**效果**: 自动包含 Trace ID 和 Span ID，无需手动配置 MDC 模式。

### 2.2 Metrics 与 Tracing

- **Micrometer Tracing**: 替代了 Spring Cloud Sleuth。底层支持 Brave 或 OpenTelemetry。
- **生态整合**: Spring AI、Spring Security 等所有项目都已接入这套观测 API。
- **可视化**: 可以轻松集成 Grafana (Metrics) 和 Tempo (Tracing) 进行全链路追踪。

## 3. 效率与性能 (Efficiency)

### 3.1 虚拟线程 (Virtual Threads)

只需一行配置即可在 Java 21+ 环境下启用虚拟线程，极大提升高并发 IO 密集型应用的吞吐量。

**配置**: 

```properties
spring.threads.virtual.enabled=true
```

**覆盖范围**:
- 内嵌 Web 容器 (Tomcat, Jetty, Undertow)
- 任务调度 (Schedulers)
- 消息监听器 (RabbitMQ, Kafka listeners)
- **3.4 新增**: WebSocket 支持

### 3.2 CDS (Class Data Sharing) - Spring Boot 3.3 重点

CDS 通过缓存类的元数据来缩短 JVM 启动时间和减少内存占用。

**优势**: 相比 Native Image，CDS 依然运行在标准 JVM 上，兼容性更好，虽然启动速度不如 Native Image 极致，但比普通 JAR 快得多。

**流程**:

1. **解压 JAR (Explode)**: 提高加载效率。
2. **训练运行 (Training Run)**: 生成 CDS 归档文件 (.jsa)。
   - 参数: `-Dspring.context.exit=on-refresh` (启动后立即退出)。
3. **生产运行**: 加载归档文件启动。

**Buildpacks 支持**: 只需配置 `BP_JVM_CDS_ENABLED=true`，Buildpacks 会自动处理训练和归档过程。

### 3.3 Docker Buildpacks 改进

- **更小的镜像**: 3.4 版本使用了新的 Tiny Builder，镜像体积减少约 23%（移除了 Shell 等组件）。
- **ARM 支持**: 终于可以通过配置 `imagePlatform` (如 `linux/arm64`) 原生构建 ARM 架构镜像。

## 4. 客户端 API 现代化 (Client Support)

Spring 正在从旧的 Template 模式向流式（Fluent）Client 模式演进。

### 4.1 RestClient

同步 HTTP 客户端的现代化替代品，底层仍可使用 RestTemplate 的基础设施，但 API 更优雅。

```java
// 旧方式: RestTemplate (依然支持但API较旧)
// 新方式: RestClient
RestClient client = RestClient.create(baseUrl);
Book book = client.get()
    .uri("/books/{id}", 1)
    .retrieve()
    .body(Book.class);
```

### 4.2 JdbcClient

对 JdbcTemplate 的流式封装，简化 SQL 操作。

```java
jdbcClient.sql("SELECT * FROM speaker WHERE id = :id")
    .param("id", 1)
    .query(Speaker.class)
    .optional();
```

## 5. Actuator 增强

- **Info 端点增强**: 新增 Process (CPU/内存信息) 和 SSL (证书有效期信息) 贡献者。
- **细粒度权限控制**: 以前暴露端点要么全开要么全关，现在可以配置访问级别。
  - 例如：`management.endpoint.loggers.access=read-only` (只允许查看日志级别，禁止 POST 修改)。
- **SBOM 支持**: 集成 CycloneDX 插件后，Actuator 可通过 `/actuator/sbom` 端点暴露软件物料清单，助力安全合规。
- **Scheduled Tasks**: 新增 `/actuator/scheduledtasks` 端点，展示定时任务的执行周期、甚至上次执行的异常信息。

## 6. 测试体验升级 (Testing)

Spring Boot 3.4 重构了 Bean 覆盖机制，解决了长期以来 `@MockBean` 的一些痛点。

### 6.1 新的 Bean 覆盖注解

- `@MockitoBean`: 替代 `@MockBean`。
- `@MockitoSpyBean`: 替代 `@SpyBean`。
- `@TestBean`: 允许通过静态工厂方法在测试中完全替换某个 Bean 的实例。

### 6.2 MockMvcTester

结合 AssertJ 提供更流畅的断言体验，支持 JSON 结构验证。

```java
// 支持 AssertJ 风格
assertThat(response)
    .hasStatusOk()
    .hasContentTypeCompatibleWith(MediaType.APPLICATION_JSON)
    .bodyJson()
    .extractingPath("$.name")
    .isEqualTo("Sergi");
```

## 7. 未来展望

- **Spring Boot 3.5** (2025年5月): 3.x 系列的最后一个版本。
- **Spring Boot 4.0** (2025年11月):
  - **基准**: Java 17 (依然支持)，全面拥抱 Java 21+ 特性。
  - **规范**: Jakarta EE 11。
  - **代码质量**: 引入 Null-safety (JSpecify) 支持。
