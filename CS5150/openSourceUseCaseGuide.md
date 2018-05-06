## Introduction
Thank you for participating in user testing for a new package for the Atom Text Editor. Today, you will be presented with a variety of tasks. **The focus of these tasks will be on the plugin itself, not on you as a user**. You are free to quit at any time.

This test will take approximately 30-45 minutes. All personal data will be kept confidential, reviewed only by the our team and the CS 5150 course staff.  The results of your test will be written up in a report with all personally identifiable data removed.

Over the course of the test, your screen interaction will be recorded using screen capture. Moreover, the administrative team will be personally observing and noting your interaction with the program. Again, the focus of our notes will be on the program, not you as the user.

You will be presented with a [guide](https://github.com/Saqif280/atomic-management#readme) on how to work with this particular package, but this will be the only guidance you will have regarding the user testing. If you are truly stuck on a particular aspect, you may skip it; however, we will not be able to answer any questions you have while the test is being conducted. At the end of the test, we will ask you some questions regarding your experience with the package.

If you have any questions regarding the use of the results of the user testing, feel free to contact the development team liaison, Daniel Hirsch, at djh329@cornell.edu. We thank you for your participation.

## Setup
Please make sure your Atom version is at least 1.26.0. Please also install the
php-server package.

## Scenario
You are leading a team of developers on a new PHP project. You have started
writing some code for the project, but you know how much effort it takes to get
everyone on a uniform development environment. You decide to check out a
package called `atomic-management` that a friend recommended to you.

## Task 0
Please go to the GitHub page for `atomic-management` and install the package.

https://github.com/Saqif280/atomic-management

## Task 1
Please open `Project1` as project root directory in Atom.

## Task 2
In order to make everyone's code consistent and easy to read, you decide it
would be best if everyone on the team had:
* tab spacing of length 2
* soft wrap enabled in the text editor

Since your team has decided to standardize on using MAMP as a local testing
server, you also decide that it would be good to:
* Disable the `php-server` package for just this project

Make a configuration file to enforce these ideas.

## Task 3
Now open up the `Example17` folder **in the same window** (`File > Add Project Folder`).

## Task 4
You would like to set a tab spacing of length 4 (for all files) in the `Example17`
folder. Make a configuration file to enforce this.

## Task 5
You want to prove to yourself that these configurations actually work. Try
working with Atom in this project to make sure these configurations are active.
