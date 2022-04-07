docker run -it --rm -v /home/libor/projects/ruby/blog-remake:/app:Z -v /home/libor/projects/ruby/blog-remake/_site:/_site:Z -w /app -p 4000:4000 starefossen/github-pages jekyll build
