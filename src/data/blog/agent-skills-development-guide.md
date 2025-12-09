---
title: "Agent Skills 开发与架构实践指南"
author: 李宏杰
pubDatetime: 2025-12-09T00:00:00Z
modDatetime: 2025-12-09T00:00:00Z
slug: agent-skills-development-guide
featured: false
draft: false
tags:
  - AI
  - Agent
  - Architecture
  - MCP
  - Claude
description: "介绍一种新的 AI Agent 开发范式：Agent Skills。该范式主张利用通用 Agent 搭配模块化的技能来解决领域专业性问题，而非为每个细分领域构建独立的 Agent。"
---

## Table of contents

## 概述

基于 Anthropic (Barry Zhang & Mahesh Murag) 在 AI Engineer 峰会上的演讲总结。

**视频来源**: [Don't Build Agents, Build Skills Instead](https://www.youtube.com/watch?v=example)

本文档旨在介绍一种新的 AI Agent 开发范式：Agent Skills。该范式主张停止为每个细分领域构建独立的 Agent，转而利用通用 Agent（General Purpose Agents）搭配模块化的"技能（Skills）"来解决领域专业性问题。

## 1. 核心理念：从 Agent 到 Skills (The Paradigm Shift)

在早期开发中，我们倾向于为不同领域（如税务、编程、数据分析）构建完全不同的 Agent，每个 Agent 都有自己独立的工具集和脚手架。但这种方式难以扩展，且 Agent 往往缺乏深度的领域专业知识（Domain Expertise）。

- **旧模式**: 为每个用例构建一个 Agent (One Agent per Use Case)。
- **新模式**: 通用 Agent + 运行时环境 + Skills。

### 1.1 什么是 Skill？

Skill 本质上是一个文件夹。它是包含可组合过程性知识（Composable Procedural Knowledge）的集合。

- **载体**: 文件系统目录。
- **内容**: 代码脚本（Python/Bash）、文档（Markdown）、元数据。
- **优势**: 版本控制友好（Git）、易于分享（Zip/Drive）、非技术人员也可创建。

## 2. 架构设计 (Architecture)

新的通用 Agent 架构由四个关键部分组成，形成了一个标准化的 Agent 堆栈。

### 2.1 架构组件

- **Agent Loop**: 管理模型的内部上下文，控制 Token 的输入输出。
- **Runtime Environment**: 提供文件系统访问、代码执行能力（读写代码、运行 Bash）。
- **MCP (Model Context Protocol)**: 提供与外部世界的连接性（数据源、API）。
- **Skills**: 提供特定领域的专业知识（Expertise）。

### 2.2 交互流程图

```mermaid
%%{init: {'theme': 'neutral'}}%%
graph TD
    User[用户/任务] --> AgentLoop
    
    subgraph "通用 Agent 运行时 (Runtime)"
        AgentLoop[Agent 循环 & 上下文管理]
        FS[文件系统 & 代码执行]
    end
    
    subgraph "扩展能力"
        MCP[MCP Servers]
        Skills[Skills Library]
    end
    
    AgentLoop <-->|读写文件/运行脚本| FS
    AgentLoop <-->|获取数据/连接外部工具| MCP
    AgentLoop <-->|获取专业知识/流程| Skills
    
    note right of MCP: 提供"连接性" (Connectivity)<br/>例如: 数据库, API, 浏览器
    note right of Skills: 提供"专业知识" (Expertise)<br/>例如: 税务代码, 数据分析脚本
```

## 3. Skill 的内部结构与工作流 (Anatomy of a Skill)

### 3.1 渐进式披露 (Progressive Disclosure)

为了保护 Agent 有限的上下文窗口（Context Window），Skill 不会一次性全部加载。

- **元数据阶段 (Metadata)**: Agent 只能看到 Skill 的名称和简短描述。
- **按需加载 (Runtime Loading)**: 当 Agent 决定使用某个 Skill 时，它会读取该 Skill 文件夹下的 `skill.md` 或核心指令文件。
- **执行**: Agent 根据指引执行文件夹内的脚本或工具。

### 3.2 示例结构

一个典型的 Skill 文件夹结构可能如下所示：

```text
financial-report-skill/
├── skill.md           # 核心指令：告诉 Agent 如何生成报表
├── metadata.json      # 简短描述：用于 Agent 检索
├── scripts/
│   ├── fetch_data.py  # 工具：获取数据的脚本
│   ├── analyze.py     # 工具：分析数据的脚本
│   └── style_ppt.py   # 工具：格式化 PPT 的脚本（固化最佳实践）
└── templates/
    └── report.tex     # 模版文件
```

**案例**: 视频中提到，Claude 经常需要重复编写相同的 Python 代码来调整 PPT 样式。通过将该脚本保存为 Skill 中的一个工具，Agent 可以直接调用该脚本，既节省了 Token，又保证了输出的一致性。

## 4. Skills 与 MCP 的关系

开发者常混淆 Skills 和 MCP (Model Context Protocol)。两者的分工非常明确：

| 特性 | MCP (Model Context Protocol) | Skills |
|------|------------------------------|--------|
| **核心价值** | 连接性 (Connectivity) | 专业知识 (Expertise) |
| **功能** | 提供通用的工具接口（如读取数据库、操作浏览器）。 | 编排多个工具，提供特定任务的"最佳实践"和流程知识。 |
| **类比** | 硬件接口 / 驱动程序 | 应用程序 / 业务逻辑 |
| **示例** | BrowserBase MCP (提供浏览器控制能力) | "Web Research Skill" (指导 Agent 如何使用浏览器进行深度调研) |

## 5. 生态系统与未来 (Ecosystem & Future)

### 5.1 三类 Skills

1. **Foundational Skills**: 赋予 Agent 全新的通用能力（如：编辑 Office 文档、科学计算）。
2. **Third-party Skills**: 生态合作伙伴提供的特定产品能力（如：Notion 搜索、BrowserBase 自动化）。
3. **Internal/Enterprise Skills**: 企业内部定义的最佳实践（如：公司代码规范、内部软件部署流程）。

### 5.2 像软件一样对待 Skills

随着 Skills 变得复杂，未来的开发将引入软件工程的最佳实践：

- **测试与评估 (Eval)**: 确保 Skill 被正确触发且产出高质量结果。
- **版本控制 (Versioning)**: 追踪 Skill 演进带来的行为变化。
- **依赖管理 (Dependencies)**: Skill 可能依赖其他 Skill 或特定的 MCP Server。

### 5.3 愿景

- **非技术人员参与**: 财务、法务等职能部门人员可以通过整理文件和文档来创建 Skills。
- **自我进化**: Agent (如 Claude) 可以在运行过程中总结经验，自己编写脚本并保存为新的 Skill，实现"持续学习"。

## 6. 总结

> "Code is all you need."

未来的 Agent 开发不再是训练新的模型或构建复杂的独立应用，而是：

1. 部署一个强力的通用 Agent 运行时。
2. 配置必要的 MCP Server 连接数据源。
3. 通过 Skills 文件夹注入特定领域的流程和知识。

这种方式让知识可复用、可移植，并且随着 Agent 的使用，这些 Skills 库将成为组织内宝贵的知识资产。
