# mwsd-js

Monier-Williams Sanskrit-English Dictionary in your browser.

## Features

The dictionary requires only a web browser to work (written entirely in JS6/HTML5/CSS3). 

The fully implemented features include:

- modern, responsive layout
- fast searches
- accepts HK (Harvard-Kioto) or IAST to input Sanskrit terms
- full text search (search keywords as well as word definitions) both for Sanskrit and English terms
- fuzzy searches (you need to know only part of a word)
- highlighting search matches
- syntax highlighting (keywords, compounds, grammatical categories are in color)

## To Do

### High priority

- 'auto-diacritics' input method: write no diacritics at all and allow dictionary to search for all possible alternatives e.g:

~~~
 'bhava'
~~~

will automatically search for

~~~
 'bhava', 'bhāva', 'bhavā', and 'bhāvā'
~~~

- search suggestions based on search history
- search suggestions based on dictionary keywords
- proper caching of search results

## Low priority

- Velthuis input method  
