## Development with Eleventy

Blog can be found at https://libka-b.github.io/

### Develop locally

Build docker image:

```
docker build -t eleventy .
```

Run:

```
docker run -it --rm -p 8080:8080 eleventy --serve
```

Build and output to the `_site` directory:

```
docker run --rm -v ${PWD}:/app/_site --name eleventy -p 8080:8080 femtopixel/eleventy --output=_site
```

### Configuration

Configuration file is located at [`.eleventy.js`](.eleventy.js). Details to modify the configuration can be found [here](https://www.11ty.dev/docs/config-shapes/).

### Templates

Templates can be found within [`src/_includes/layouts`](src/_includes/layouts) directory. It must always contain `base.html` file in the minimum.

### Static files

Static files are configured in the [`.eleventy.js`](.eleventy.js) using `config.addPassthroughCopy('some-folder')`. Where `some-folder` gets copied over to the `dist` as is.
