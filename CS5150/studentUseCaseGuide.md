## Introduction
Thank you for participating in user testing for our new additions to the Atom Text Editor. Today, you will be presented with a variety of tasks using a new package and the Atom Text Editor. **The focus of this code will be on the program itself, not on you as a user**. You are free to quit at any time.

This test will take approximately 30 minutes, and you may opt out of this testing at any time. All personal data will be kept confidential, reviewed only the development team and the CS 5150 course staff.  The results of your test will be written up in a report with all personally identifiable data removed.

Over the course of the test, the development team will be recording your own screen interaction using screen capture. Moreover, the development team will be personally observing and noting your interaction with our program. Again, the focus of our notes will be on testing the program, not you as the user.

You will be presented with a guide on how to work with our package, but this will be the only guidance the development team will give you regarding the user testing. If you are truly stuck on a particular aspect, you may skip it; however, the development team will not be able to answer any questions you have while the test is being conducted. At the end of the test, the conductors of the survey will ask you some questions regarding your experience with out package.

If you have any questions regarding the use of the results of the user testing, feel free to contact the development team liaison, Daniel Hirsch, at djh329@cornell.edu. We thank you for your participation

## Task 1
Using the Atom text editor, open the file `test1.md` in the folder `UserTesting` in `Documents`. Your goal is to open the file with the following configuration:
* Background styling is white,
* The markdown live preview is disabled
* Tab spacing is set to 2 spaces

<!--  Task should be situated that they will actually use (not theme), don't be soso leading
, not setting the user up for why they are making these changes. Motivation. Tree view package, hide version control package. Scenarios, what are the professor use cases. It's a seperate objective. The task 3 should be how do people react to changes. -->

<!--  Open test 1, not the config file, be more clear. "You are expected". The situation is students have squ-lite files in the git ignore, but the website.sqlite was hid by git because of atom files. "In a piazza post, the instructor said ... go to settings and do this.". For our use case, the professor said to edit the config file.  Ask them to, open another project, we want to have multiple projects in the "Same window at the same time".
Use cases
-- Instructors
create file,
test out file - find documentation for plugin (give link),
-- students
test to make sure the students configuration is loaded,
(if they muk, what kind of things do they do)
Use case with conflicting settings from multiple projects open, THIS WILL HAPPEN,
Change the setting, they will likely try to do it global


General
Make sure to brief them - testing the software, not them
There is a new package out there, we want to know if it should be used in 1300.
GET RID OF PRONOUNS.
Please talk outloud as you think through. As adminstrators, we can prompt them to speak outloud. I see you are clicking on things, can you explain why. "Re"

Add test case about changing a factor, you forgot to install this required pacakge.
Markdown preview isn't installed, lets see what happens when they are supposed to do something with it
-->

Your goal is to do this without manually changing any of these properties.
We will give you the following advice: In order for a configuration styling to take affect, atom must be opened with a project that contains a `.atomconfig` file, not just opening the file itself.
When you are sure these settings are present, please signal the member of the development team administering this test.


## Task 2
Using the Atom text editor, open the file `test2.md` in the folder `Test2` in the folder `UserTesting` in `Documents`. Your goal is to open the file with the following configuration:
* Text color is green,
* The Package Generator package is disabled
* Tab spacing is set to 4 spaces
Your goal is to do this without manually changing any of these properties.

For this test, you may encounter *errors* when trying to set up the package. Follow the notification that pop up for help. If you are truly stuck, continue on.

We will give you the following advice: In order for a configuration styling to take affect, atom must be opened with a project that contains a `.atomproject` file, not just opening the file itself.
When you are sure these settings are present, please signal the member of the development team administering this test
