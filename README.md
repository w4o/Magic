# Magic

小学生口算、古诗注音、识字卡片。在浏览器里排好版，再打印成 A4。不需要安装、登录或后端。

**在线使用：** [https://w4o.github.io/Magic/](https://w4o.github.io/Magic/)

## 功能

| 页面 | 文件 | 做什么 |
| --- | --- | --- |
| 首页 | [`index.html`](index.html) | 进入三个工具 |
| 小学生计算题 | [`suan-ti.html`](suan-ti.html) | 按年级生成加减乘除口算卷，可计时、对答案 |
| 古诗拼音排版 | [`gushi-pinyin.html`](gushi-pinyin.html) | 给古诗自动注音，排成可打印的 A4 |
| 中文字卡片 | [`word-card.html`](word-card.html) | 把汉字排成大方块卡片，裁开使用 |

计算题和字卡片可以离线打开。古诗注音会从 jsDelivr 加载 [pinyin-pro](https://github.com/zh-lx/pinyin-pro) `3.26.0`，这一页需要能访问该 CDN；脚本加载失败时只排汉字。

## 本地使用

克隆仓库后，用浏览器打开 `index.html` 即可。

```bash
git clone git@github.com:w4o/Magic.git
cd Magic
open index.html
```

三个工具都是单个 HTML 文件，没有构建步骤。

## 小学生计算题

打开 [`suan-ti.html`](suan-ti.html)。左侧选题型和范围，右侧是 A4 预览。

- 题型覆盖一到四年级，从 10 以内加减到万以内加减、表内乘除和两位数乘两位数。
- 可改运算、进退位、填空位置（得数或未知数）、横式或竖式、每行题数和题目数量（1–200）。
- 竖式只排加、减、乘，除法仍用横式。连加连减只用横式。
- 「换一组」重新出题。「开始计时」和「对答案」只在屏幕上使用。
- 勾选「附上答案页」后，打印时会多出一页答案。题目卷上的填空在打印时保持空白。

打印：A4 纵向，边距选「无」，并关掉页眉页脚。

可以用查询参数打开一份指定卷子：

```text
suan-ti.html?preset=mul9&count=36&layout=horizontal&answers=1
```

| 参数 | 取值 | 作用 |
| --- | --- | --- |
| `preset` | 见下表 | 题型。无效时使用 `as20`（20 以内加减） |
| `layout` | `horizontal` 或 `vertical` | 横式或竖式 |
| `count` | `1`–`200` | 题目数量 |
| `answers` | `1` | 附上答案页 |
| `show` | `1` | 在屏幕上直接显示答案 |

| 年级 | `preset` | 题型 |
| --- | --- | --- |
| 一年级 | `add10` | 10 以内加法 |
| 一年级 | `sub10` | 10 以内减法 |
| 一年级 | `as10` | 10 以内加减 |
| 一年级 | `add20c` | 20 以内进位加法 |
| 一年级 | `sub20b` | 20 以内退位减法 |
| 一年级 | `as20` | 20 以内加减 |
| 一年级 | `chain20` | 20 以内连加连减 |
| 二年级 | `as100` | 100 以内加减 |
| 二年级 | `as100c` | 100 以内进退位 |
| 二年级 | `mul9` | 表内乘法 |
| 二年级 | `div9` | 表内除法 |
| 二年级 | `md9` | 表内乘除 |
| 二年级 | `divrem` | 有余数除法 |
| 二年级 | `chain100` | 100 以内连加连减 |
| 三年级 | `as1000` | 千以内加减 |
| 三年级 | `mul21` | 两位数乘一位数 |
| 三年级 | `div21` | 两位数除以一位数 |
| 四年级 | `mul22` | 两位数乘两位数 |
| 四年级 | `mul31` | 三位数乘一位数 |
| 四年级 | `as10000` | 万以内加减 |

## 古诗拼音排版

打开 [`gushi-pinyin.html`](gushi-pinyin.html)。页面会先填入几首示例，点「生成排版」即可看到效果。

输入格式：

```text
静夜思
唐 · 李白
床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。

登鹳雀楼
王之涣
白日依山尽，
黄河入海流。
欲穷千里目，
更上一层楼。
```

- 第一行是诗题。
- 第二行如果像作者或朝代（含「唐」「宋」或间隔号 `·`，且较短、没有句读），会当成作者；否则从第二行起都算正文。
- 多首诗之间空一行。

排版可以选：拼音 + 汉字、纯汉字、田字格、超大字号。还可以改纸张方向、每页首数、纵向或双栏、字号、行距、字距和页边距。「自动适应」会把内容缩进当前页面。

单击拼音可在多音之间轮换，双击可手动改读音。这些修改会保留到下一次重新生成；「清除注音修改」会去掉它们。

## 中文字卡片

打开 [`word-card.html`](word-card.html)，输入文字后点「生成卡片」。

空格会被去掉。每个字一张 7 cm × 7 cm 的卡片，楷体大字，A4 上每页 12 张（3 列 × 4 行），沿虚线裁开。

## 项目结构

```text
index.html          首页
suan-ti.html        口算卷
gushi-pinyin.html   古诗注音排版
word-card.html      汉字卡片
.github/workflows/static.yml
```

## 部署

推送到 `main` 后，[GitHub Actions](.github/workflows/static.yml) 会把仓库根目录发布到 GitHub Pages：

[https://w4o.github.io/Magic/](https://w4o.github.io/Magic/)

也可以在 Actions 里手动运行 “Deploy static content to Pages”。

## 许可证

本仓库尚未附带开源许可证。
