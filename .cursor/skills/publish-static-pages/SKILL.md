---
name: publish-static-pages
description: >-
  Minifies Magic static pages from src/*.html into dist/ before GitHub Pages
  deploy. Use when adding or editing HTML tools, changing the publish workflow,
  or when the user mentions 静态页, 发布, 压缩, GitHub Pages, src, or dist.
---

# 发布静态页

本地预览直接打开 `src/index.html`。线上用的是压缩后的 `dist/`。

## 改页面

1. 只编辑 `src/` 里的 HTML。
2. 工具之间用相对链接，返回首页用 `index.html`。
3. 内联 `onclick` 调用的全局函数不能被压缩改名。现有的是 `createCards`，写在 `scripts/minify-pages.mjs` 的 `reserved` 里。新增这类函数时把名字加进 `reserved`。

## 发布

1. 在仓库根目录执行 `npm run build`。
2. 脚本会检查 doctype、`id`、内联脚本语法，以及 `createCards` 仍是全局函数。失败就不要发布。
3. `.github/workflows/static.yml` 在发布前执行 `npm ci` 和 `npm run build`，然后上传 `dist`。不要改回上传仓库根目录或 `src/`。

不要把压缩结果写回 `src/`。
