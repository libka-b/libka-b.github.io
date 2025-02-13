---
layout: layouts/article.html
title: 'Migrating Jekyll blog to Eleventy'
date: '2025-02-12'
---

I decided to migrate my Jekyll based blog to another static site generator based one. My eyes were first on [Hugo](https://gohugo.io/) but I found it overly complicated with little explanations. My next option was [Eleventy](https://www.11ty.dev) with its great in-depth tutorial. Here, I won't be describing my step by step process to migrating rather I will focus on differences and the overall experience.

<!-- excerpt -->

## Why migrate off of Jekyll in the first place

Jekyll was great and got me blogging 3 years ago. However, I found myself in a position where I wanted to update part of the blog, but I couldn't run it locally. The Docker image wasn't working anymore. Jekyll is written in Ruby and knowing little to nothing about it, I didn't feel like pursuing the option of running it locally either. Being seasoned developer, I didn't like the cowboy style option of updating the blog, pushing it to git and seeing what happens. That brought me to the idea of modernizing the blog.

## Why not Hugo

I liked the fact that Hugo is developed in Go which compiles into a statically linked binary. You simply download one binary and it works. However, after fiddling around a bit, I found it wasn't as straightforward to use as other options. Once you set up the project, you need to choose the theme. I wanted to make things myself and learn something new but there didn't seem to be some good tutorials on how to do your own themes and other themes that I thought I would use as a guidance seemed already too mature to be able to learn from them. I abandoned the Hugo idea after couple of hours of trying, googling and getting absolutely no progress.

## Why Eleventy

After some more research I found that there's dozens of static website generators. Having learned my lessons from Hugo, I was looking for one that would have some nice tutorial which was how I found Eleventy. Its [31 step tutorial](https://learn-eleventy.pages.dev/) seems a bit like overkill but surely it would cover all the features I would need to set everything.

I can't say I understood all of the tutorial, especially the parts where the author was setting too many classes on each of the HTML element but hey, I am not a frontend developer. It probably has some reason. I like the overall structure and the topics covered in the first 10 lessons were enough to set me up. From the configuration, to templating system, to partials, data and assets.

One thing that seemed like overkill was the CSS where, for me, it was enough to simply copy files to my destination. No SASS (hell, I don't even know what that is).

While setting up all the features to get the blog on par with my original one (or at least close to it), I realized how some things in Jekyll were really simple and I really appreciate it in retrospective. If those 3 years ago I started with something else, I might have given up on that as there were simply too many foreign concepts for me.

In Jekyll, you just name the file as '${date-time}-${title}.md' and it does all the magic for you - sorts the posts based on the date and displays the title and the first paragraph should you want to. In Eleventy, this is the work you have to do. Sorting the posts yourself, setting excerpt delimiter in each post to denote what should be displayed as excerpt, to setting up the post title.

However, knowing what I want to achieve in the first place, I also knew what to search for when being stuck and it also led me to making clear distinction between data and functionality. The original blog was also full of hacks which are mostly gone now. I want to do some updates in the future but this sets the baseline to that.

This project made me realize very important thing - it's crucial to set realistic goals. In past, I had many project ideas but there were so many unknowns that I would eventually give up. Approaching a goal with clear vision and execution path in mind is much more likely to actually meet the goal. And even when the execution path is clear, one can be sure that there will be unexpected road blocks and setbacks.
