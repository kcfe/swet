# @swet/cli

swet cli

## 快速开始

### 1. 安装

```bash
$ npm i @swet/cli -S
// or
$ yarn add @swet/cli
// or
$ pnpm add @swet/cli
```

### 2. 使用

```ts
import cli from '@swet/cli'
```

## API


## 开发

```bash
$ pnpm dev --filter @swet/cli
// or
$ pnpm -F '@swet/cli' dev
```

## 发布

### 1. [语义化提交 Commit](https://www.conventionalcommits.org/en/v1.0.0/#summary) 

```bash
$ git commit -m 'feat(cli): add some feature'
$ git commit -m 'fix(cli): fix some bug'
```

### 2. 编译（可选）

```bash
$ pnpm build --filter @swet/cli
// or
$ pnpm -F '@swet/cli' build
```

### 3. 执行发包命令

```bash
$ pnpm release

Options:
  --skipTests skip package test
  --skipBuild skip package build
```
