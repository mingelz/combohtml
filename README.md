# ComboHTML

Combo your HTML files, make scripts(.js) and stylesheets(.css) inline.

## Quick start

There are 3 directive: `inline`, `compress`, `remove`. Supports `<link>`, `<style>`, and `<script>` tags.

```html
<!-- inline remote file only -->
<link data-combohtml="inline" rel="stylesheet" href="//example.com/index.css">

<!-- inline and compress remote file -->
<script data-combohtml="inline,compress" src="//example.com/index.js"></script>

<!-- compress inline code -->
<style data-combohtml="compress">
  div {
    color: #000;
  }
</style>
<script data-combohtml="compress">
  function test (whatever) {
    var one = 1
    return one + whatever
  }
</script>

<!-- remove test/mock tag -->
<script data-combohtml="remove">
  mock = "the mock data in development environment"
</script>
```

## Install

First, make sure your Node.js `>= 4`.

```shell
npm install combohtml
```

## Command line usage

```shell
# process specified file
combohtml -i index.html -o dist.html

# process mutiple files
combohtml --input src/**/*.html --output dist
```

### Command line options

```
-i, --input <input>    Input file(s)
-o, --output <output>  Output directory or file name
-r, --root [root]      Files root path,
                       default to current working directory (process.cwd())
-a, --attr [attr]      Specified attribute,
                       default to "data-combohtml"
```
