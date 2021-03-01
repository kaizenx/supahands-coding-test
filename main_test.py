import unittest

from main import path_crawler

hunting_map = {
    'A': ['B', 'C', 'K'],
    'B': ['D', 'E'],
    'C': ['E', 'G', 'H'],
    'D': ['E', 'F'],
    'E': ['G', 'I', 'F'],
    'F': ['I', 'J'],
    'G': ['I', 'K'],
    'H': ['I', 'F'],
    'I': ['K'],
    'J': ['K'],
    'K': []
}

# Hand-crawled validation data
expected_paths = [
    ['A', 'B', 'D', 'E', 'G', 'I', 'K'],
    ['A', 'B', 'D', 'E', 'G', 'K'],
    ['A', 'B', 'D', 'E', 'I', 'K'],
    ['A', 'B', 'D', 'E', 'F', 'I', 'K'],
    ['A', 'B', 'D', 'E', 'F', 'J', 'K'],
    ['A', 'B', 'D', 'F', 'I', 'K'],
    ['A', 'B', 'D', 'F', 'J', 'K'],
    ['A', 'B', 'E', 'G', 'I', 'K'],
    ['A', 'B', 'E', 'G', 'K'],
    ['A', 'B', 'E', 'I', 'K'],
    ['A', 'B', 'E', 'F', 'I', 'K'],
    ['A', 'B', 'E', 'F', 'J', 'K'],
    ['A', 'C', 'E', 'G', 'I', 'K'],
    ['A', 'C', 'E', 'G', 'K'],
    ['A', 'C', 'E', 'I', 'K'],
    ['A', 'C', 'E', 'F', 'I', 'K'],
    ['A', 'C', 'E', 'F', 'J', 'K'],
    ['A', 'C', 'G', 'I', 'K'],
    ['A', 'C', 'G', 'K'],
    ['A', 'C', 'H', 'I', 'K'],
    ['A', 'C', 'H', 'F', 'I', 'K'],
    ['A', 'C', 'H', 'F', 'J', 'K'],
    ['A', 'K']
]


class PathCrawlerTest(unittest.TestCase):
    def setUp(self):
        self.paths = path_crawler(hunting_map)

    def test_full_crawl(self):
        self.assertEqual(self.paths, expected_paths)


if __name__ == "__main__":
    unittest.main()
