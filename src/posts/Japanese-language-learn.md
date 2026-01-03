---
layout: layouts/article.html
title: 'Japanese Language Learn'
date: '2026-01-02'
---
I am learning Japanese and decided to make an application for it.
For now, it's just a desktop application as that's the easiest way to use.
Check it out [here](https://github.com/libka-b/japanese-language-learn/tree/main)
and join me in learning or development or both!

<!-- excerpt -->

## Why not duolingo?

I was trying duolingo for both improving my english couple years ago and
then learning Japanese quite recently. In either cases it wasn't very successful.
I don't think the 5-minutes-learning-a-day model works and their gamification
system makes the matter even worse. I often felt like I want to beat the clock
or get the lesson done today just so that I would continue the streak. But that's
not the right goal.

I think the goal when learning a new language really should be to build strong foundations.
To be comfortable reading and talking and listening. That's why I am trying to design
my application to be actually used for focused learning, maybe 1 hour a day. It's always
up to the user of course but I think more serious approach is required.

I still think some sort of gamification makes sense. But I want to focus on measuring
how the user improves their abilities over time. Ideally, the application should also
prefer training previously failed exercises rather than just random ones. This is
to strengthen building the right foundations.

## Technical details

Since I wanted the application to be desktop from the beginning, and knew about
[Electron](https://www.electronjs.org/) being a framework for building desktop apps,
I started with that. However, very quickly I ran into so many quirks that the framework
assumes that I decided to switch over to some other.

I found [Tauri](https://v2.tauri.app/) being a Rust application with frontend of choice.
For long time I wanted to use Rust for some application but never had anything beyond
a simple calculator. But this application seems to be the right scale and the time
is also right, since Rust is much more approachable when you're backed by LLM. I am
planning on making a separate blog post about developing Rust application as a Kotlin
developer and also on using LLM (although there's probably a lot of such content out there).

The application started simple, as a PoC I just had the backend return a hiragana character
and validate user's input vs. the expected one. Then integrated Gemini to basically generate
a sentence and then validate user's translation. There is still some fine-tuning of the
prompts to be done but it's definitely working quite well.

## What's next

My vision is to make the application a sort of one stop application for learning (at least)
beginner level Japanese. I'd like to make it easy to learn both Hiragana and Katakana, and
I also want to explore some deeper knowledge learning. Ideally Kanji too, but not sure where
to begin even. With that said, here are some areas I'd like to explore and add to the app
(in no particular order):

- Displaying Hiragana (and other) character set along with the English pronounciation.
- Creating a system for drawing individual characters and validating the strokes.
- Improving vocabulary learning.
- Text-to-speech and speech-to-text to practice listening and reading.

The above are sort of stepping stones on top of which there are some deeper things to make,
such as grammar learning, etc... Can't say when any of these will be done, afterall I am
doing it in my free time. However, I'll be happy to have anyone helping with this endeavor!
