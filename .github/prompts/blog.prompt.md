# 博客文章处理流程

当用户提供一个 Markdown 文件需要发布到博客时，请按以下步骤处理：

## 1. 文件位置检查

- 博客文章必须放在 `d:\code\blogs\blog\src\data\blog\` 目录下
- 如果文件不在此目录，需要移动文件

## 2. 文件重命名

- 文件名应使用英文小写，单词之间用 `-` 连接
- 文件名应简洁且有意义，反映文章主题
- 示例：`spring-di.md`、`react-hooks-guide.md`

## 3. Metadata 补充

每篇文章必须包含以下 frontmatter metadata：

```yaml
---
title: "文章标题"
author: 李宏杰
pubDatetime: 2025-12-04T00:00:00Z  # 发布时间，使用当前日期
modDatetime: 2025-12-04T00:00:00Z  # 修改时间，使用当前日期
slug: article-slug                  # URL 路径，与文件名一致（不含 .md）
featured: false                     # 是否为精选文章
draft: false                        # 是否为草稿
tags:                               # 标签列表，2-5 个相关标签
  - Tag1
  - Tag2
description: "文章简短描述，用于 SEO 和预览，建议 100-200 字"
---
```

## 4. 代码块语法高亮

所有代码块必须指定语言标识符：

- Java: ` ```java `
- JavaScript: ` ```javascript ` 或 ` ```js `
- TypeScript: ` ```typescript ` 或 ` ```ts `
- Python: ` ```python `
- Shell: ` ```bash ` 或 ` ```shell `
- JSON: ` ```json `
- YAML: ` ```yaml `
- SQL: ` ```sql `
- HTML: ` ```html `
- CSS: ` ```css `

检查所有 ` ``` ` 代码块，确保都有语言标识符。

## 5. Mermaid 图表检查

如果文章包含 Mermaid 图表：

- 代码块必须使用 ` ```mermaid ` 标识
- 验证 Mermaid 语法正确性：
  - `sequenceDiagram` - 时序图
  - `flowchart` 或 `graph TD/LR` - 流程图
  - `classDiagram` - 类图
  - `stateDiagram` - 状态图
  - `erDiagram` - ER 图
  - `gantt` - 甘特图

常见语法检查项：
- 箭头语法：`-->`、`->>>`、`-.->` 等
- 节点定义：`A[文本]`、`B{判断}`、`C((圆形))`
- 参与者定义：`participant A as 别名`

## 6. 目录生成

在 frontmatter 之后、正文之前添加目录标记：

```markdown
## Table of contents
```

这会自动生成文章目录。

## 7. 构建验证

执行以下命令验证文章可以正常编译：

```powershell
Set-Location d:\code\blogs\blog
npm run build
```

如果构建失败，根据错误信息修复问题。

## 8. 本地预览（可选）

启动开发服务器预览效果：

```powershell
Set-Location d:\code\blogs\blog
npm run dev
```

访问 http://localhost:4321 查看效果。

## 9. 提交发布

构建成功后，提交并推送到 GitHub：

```powershell
Set-Location d:\code\blogs\blog
git add -A
git commit -m "发布文章：文章标题"
git push
```

Vercel 会自动检测到更新并部署。

## 完整处理示例

给定一个原始 Markdown 文件，完整处理流程：

1. 移动文件到 `src/data/blog/` 目录并重命名
2. 添加 frontmatter metadata
3. 检查并修复所有代码块的语言标识符
4. 检查 Mermaid 图表语法
5. 添加目录标记
6. 运行 `npm run build` 验证
7. 提交并推送到 GitHub

## 常见问题处理

### 代码块没有语言标识符
将 ` ``` ` 替换为 ` ```语言 `

### Mermaid 图表无法渲染
- 检查语法是否正确
- 确保使用 ` ```mermaid ` 标识
- 图表会在客户端渲染，需要 JavaScript 支持

### 构建失败
- 检查 frontmatter YAML 格式是否正确
- 检查特殊字符是否需要转义
- 检查日期格式是否正确（ISO 8601 格式）
