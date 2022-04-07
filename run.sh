docker run -it --rm -v `pwd`:/app:Z -v `pwd`/_site:/_site:Z -w /app -p 4000:4000 starefossen/github-pages
