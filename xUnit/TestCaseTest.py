from TestCase import *
from WasRun import *

class TestCaseTest(TestCase):
    def testRunning(self):
        test = WasRun("testMethod")
	assert(not test.wasRun)
	print(test.wasRun)
	test.run()
	assert(test.wasRun)
	print(test.wasRun)

TestCaseTest("testRunning").run()
