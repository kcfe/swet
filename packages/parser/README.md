# @swet/parser

swet parser

## 快速开始

### 1. 安装

```bash
$ npm i @swet/parser
// or
$ yarn add @swet/parser
// or
$ pnpm add @swet/parser
```

### 2. 使用

```ts
import { SwetParser } from '@swet/parser'
```

## API

## 开发

```bash
$ pnpm dev --filter @swet/parser
// or
$ pnpm -F '@swet/parser' dev
```

## 发布

### 1. [语义化提交 Commit](https://www.conventionalcommits.org/en/v1.0.0/#summary)

```bash
$ git commit -m 'feat(parser): add some feature'
$ git commit -m 'fix(parser): fix some bug'
```

### 2. 编译（可选）

```bash
$ pnpm build --filter @swet/parser
// or
$ pnpm -F '@swet/parser' build
```

### 3. 执行发包命令

```bash
$ pnpm release

Options:
  --skipTests skip package test
  --skipBuild skip package build
```
