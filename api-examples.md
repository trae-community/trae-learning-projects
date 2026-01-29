# 运行时 API 示例

VitePress 提供了一些内置的运行时 API 来帮助你在 Markdown 中使用 Vue 的功能。

## useData

`useData` API 可以让你访问当前页面的所有元数据。

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

### 站点数据
<pre>{{ JSON.stringify(site, null, 2) }}</pre>

### 页面数据
<pre>{{ JSON.stringify(page, null, 2) }}</pre>

### Frontmatter
<pre>{{ JSON.stringify(frontmatter, null, 2) }}</pre>
