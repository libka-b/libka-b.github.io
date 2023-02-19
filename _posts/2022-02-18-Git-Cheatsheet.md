---
layout: default
---
It just recently happened to me that I wanted to do something in git,
I knew exactly what but was unable to remember the git command
that would do that. So I decided to make this blog, mainly for me,
to keep all my favorite git commands and workflows in a single place.
But if someone else finds this useful it would be great.

Many developers tend to use the VCS (git) support built into their favorite
IDE which is shame as git is very powerful tool and the IDE support
cannot possibly cover all the flags that git commands offer. And it's also
fun to compete with colleagues to achieve one thing in different possible ways
which with git you totally can.

I will go through most of the git commands, leaving out the boring ones (`rm`, `mv`, `status`, 
`tag` and `fetch`), the new ones (`switch`, `restore`) and those that I don't 
use very much (`bisect`, `show`).

## clone

Well, there's not much to this command, just copy the link from the repository
you want to clone and run `git clone <my-awesome-repo>`.

There are many possible options to this command with little to no value in the
online world. One option is really worth mentioning though, `<directory>` 
specifies which directory to clone the repository to. So 
`git clone ssh://whatever/my-awesome-repo.git awesome` will clone your repo into
directory `awesome` instead of `my-awesome-repo` which may save one `mv` command.

## init

Also not much to this command. Just the `--initial-branch` flag can save some typing
when you don't want to use the default branch name. Yes, I am the one old developer
who started with git when default was `master` and always want to cry when I type
`git checkout mas`, hit tab and nothing happens.

This command is however often followed by `git remote` and perhaps `git config`.

## remote

Because working with origin may be pain. Initializing a repository is usually followed
by setting up a remote repository. Github for one generates the commands to run right
after creating a new repo and shows them until the first commit is pushed. But github
is not the only git hosting system and not all have to be that nice. So it's better to
know the commands than be sorry.

To set up an origin do `git remote add origin <repo>`. It also comes in handy to be able
to change origin. That's done by `git remote set-url origin <repo>`. Of course the
remote repository doesn't have to be named `remote` but it's a convention in most of
the projects. Command to see the name of the remote repo is `git remote -v`.

## config

We all know those commands that always show up when trying to push code on freshly
installed laptop.

```
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository
```

Using `git config` is also way to set up some alias. Just run
`git config --global alias.<my-alias> <git-command>`. For example
my favorite one is
`git config --global alias.lol "log --all --decorate --oneline --graph"`,
then I simply run `git lol` and see a nice graph of commits on current
repository.

For fans of editors different than `vim` it can be useful to set a 
different one using `git config --global core.editor <editor-path>`.

And not to forget, it can also serve for setting up a global gitignore.
As I always name temporary files using dirty words (in czech, 
so luckily majority of the world won't understand), I used to set them
in the global gitignore, so that they don't end up accidentally in the
remote repository. `git config --global code.excludesfile ~/gitignore`
sets the global gitignore to file `~/gitignore` but it's up to anyone to
name the file. It could just as well be `/root/ignorant` with the right 
permissions.

## add

This is one of the first command everyone learns when starting with git,
and it's one of the most often used I dare say. It simply indexes the changes
to be committed the next time `git commit` is run. However, it has some
interesting options. 

`git add -N` adds the file to the index, but without it's content. This is
extremely useful when working a on new file as it makes it possible to
`git diff` the changes made to the file.

Another interesting option is `git add -p`. It let's you interactively add
chunks of code in a file while leaving others not added. My manager once asked
me about this option and I explained him. He then told me something like:
"Well, it seems to me like you are putting something bad into the code and
then have to bypass it this way." And he was right. I was using this way to
keep secrets in my code and not commit them to the repo. But of course I forgot
from time to time.

Some people tend to use `git add -A` before committing the changes. I advice
against it and will talk of it later in the `diff` section.

## diff

This is very important command and I believe it should be used at least as 
often as `git add`. Apart from diffing the changes on modified files, it
can diff changes between commits, branches and even between remote servers.
For example `git diff <commit-1>:<path> <commit-2>:<path>`.

Mostly, though, it's necessary to simply diff the change on modified files.
Many people tend to run `git diff` which will diff all the changes made, 
usually followed by `git add` and commit. I personally don't like this 
approach and I have seen the bad results of this. My colleague once committed
his changes this way as he was used to, but then in the CI the build was 
failing. He spent hours searching for the fault only to discover that one
file that was supposed to be named somehow contained a space in its name
and so the build system would ignore (rightly). If diffing and adding
files one by one, this would never happened because the author would
spot the trailing space on the spot. 

And I suggest doing that - before
committing to go through each file individually and thoroughly
check the changes made and add each file after done checking. If new changes
need to be made to already added files, iterate the whole process until
all files to be added are thoroughly checked and added.

## grep

Similar to classic `grep` with the only difference that the grepped files are
the ones not ignored in the current repository.

## log

Very powerful tool for searching the short commit messages as well as the
long ones. As I mentioned in the config section, my favorite is
`git log --all --decorate --oneline --graph` as it displays graph of commits
along with their respective branches and where the current `HEAD` is and
where origin is.

## checkout

Possibly, `git switch` and `git restore` are modern substitute commands
for `git checkout`. Perhaps because `checkout` does many different things.
However, I am still used to checkout.

`git checkout -b <branch-name>` creates a new branch and switch to it.
Adding `--orphan` flag will create a new branch that has no common history.
That might be good for example for generating automatic docs in a separate
branch (like `gh-pages`) where no commit history or common commit is
needed, and yet it is fitting for the branch reside in the same repository.

`git checkout <branch-name|commit>` switches to existing branch or commit.
While `git checkout <filename>`, where there are unstaged changes to the 
filename, undoes those changes.

Checkout works with the `-p` parameter similarly to the `add` although in
exactly opposite way - yesed chunks are checked out. It sounds obvious
but may be very confusing.

## branch

Without any parameters, it lists all the branches in local repository.
Adding `-r` option shows remote branches. Replacing `-r` with `-a`
lists branches on both local and remote.

Deleting branches might get tricky. To delete merged branch,
`git branch -d <branch-name>` should suffice. However, when there
are some unmerged changes and the branch is still to be removed,
the command must be run with `--force` or using `git branch -D <branch-name>`.
These commands delete branch locally, but if we also want to get rid
of its origin counterpart, we need to push the change to the remote
repository. In the `push` section I will try to explain this.

Sometimes there's a need to rename a branch. To do so, run
`git branch -m <new-branch-name>` on the branch to be renamed. Using
`-M` instead of `-m` forces the rename.

## commit

The command for adding the currently staged changes to the commit history.
Most often use is `git commit -m "<commit-message>"`. I often find myself
in a need to update a commit (because I forgot to update some files and
tests are not passing, updating documentation,... There may be many reasons
for that) and the way to do that is `git commit --amend`. If the commit
is already in the remote, then updating it in remote branch is done using
force push (not recommended on main branch though).

Sometimes rewriting the commit author comes in handy (for example when
using work computer for both work and github projects and forgetting
to set author locally). This is achieved by `git commit --amend --reset-author`.

## merge

Git merge is often a straightforward operation. Make a branch, do some
changes, merge to the main branch, resolve conflicts and it's done.
But resolving conflicts while merging creates a merge commit which may
be undesirable. There's a flag for that, `--ff-only`, which refuses to
merge the branch when that would result in conflicts. The way to "resolve
conflicts upfront" without creating a merge commit is rebasing the branch
on top of the branch to merge to.

## rebase

The classic approach to rebasing is to run `git rebase -i <branch-to-rebase-to>`
on the branch to be updated. Atlassian has a really great 
[docs](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase) 
explaining how this works. The `-i` option makes the rebasing interactive
in terms that for each commit, it will try to resolve conflicts where possible
and where not, it will let the user to do so and by running `git rebase --continue`
continue to the next commit, or by running `git rebase --abort` to abort the
rebase and return to the state before running `git rebase -i`. Git status while
rebasing (as well as merging) is the best friend.

Rebasing is also used to fix-up or squash commits. This is a great thing to do
in order to keep the commit history clean.

## reset

Git reset is another good friend. It comes in handy in multiple ways. One is
to "undo" a commit. I often run command `git reset HEAD^1 --soft`. This will
undo (and remove) the last commit but keep all the changes staged, allowing 
one to see the changes files.

Hand in hand with resetting a commit comes resetting a staged file. To do that
run `git reset HEAD <file-name>`.

There's also more brutal way to "undo" a commit and that's 
`git reset HEAD^1 --hard`. This simply removes all untracked files, undoes the
last commit and clear all changes done. It changes the state of the repository
to the exact one as of the previous commit.

## revert

Revert creates a commit with exact opposite changes. So for example running
`git revert HEAD^1` will create a new commit with exact opposite changes as
those done in the last commit. This may come in handy when there are changes
to be reverted on main branch where force pushing would make all other developers
just angry.

## stash

Running `git stash` will save all currently made changes (to save the untracked
files, add `--include-untracked` flag) to the stash, making current index clear.
This is very important when, for example, there's work in progress on current branch
and a critical bug emerges in production that needs to be immediately fixed. Without
stashing the changes, the workaround would be to commit the changes and then to reset 
them.

Listing the stashed changes can be done using `git stash list` and using `git lol` 
(shown above) shows on which commits the changes were stashed.

Running `git stash pop` will load the changes from the stash and drop them from the stash. 
Beware, if loading the changes would result in merge conflicts, the changes are not
dropped from the stash. This tripped me quite recently and I was wondering why
I was getting always the same changes from the stash when running `git stash pop`
and thought it was a bug, only to find out that this was desired behavior. In case
like that `git stash drop` does the job.

## pull

Git pull may look like one of the boring commands but there are some quirks to it.
When the local and remote history don't differ, it will just update
the local history (the happy scenario).

When the local and remote history differ (this may happen for example as a result
of two merged branches that were changing different lines of code and therefor not
creating merge conflicts) the classic `git pull origin <branch>` will fail. In such
case we are dealing with a merge and git pull defines some flags to deal with it
the right way.

One way would be to run `git pull origin <branch> --force` which will result
in complete rewriting local history with the remote history. This may be good
enough to make sure the repositories are in sync.

Another way would be to pass in `--rebase=interactive` flag to solve the local
history as needed. This may come in handy when the local history is ahead of
remote history as the `--force` flag would erase the extra local commits.

Pull also allows to specify different merge strategies using `--strategy-option`,
that however may result in creating an extra commit which may be undesirable.

## push

Pushing is simple, except when it isn't. When rebasing or mangling already
pushed commit, it must be pushed with `--force` flag. Just make sure not to
do it on the main branch.

Another thing where pushing is necessary is for removing remote branches.
To do that, after removing the branch locally, run `git push origin :<branch>`.
The empty space before the `:` is because the branch doesn't exist locally
anymore.

## Conclusion

In my years of coding I've used many of the flags and tools git offer some of
them may be thought of as esoteric even but it's fun and each one of them
helps towards greater understanding of git, and workflows it allows. 

And of course while writing this, I keep the document versioned in git :)
