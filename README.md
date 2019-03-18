# mwsd-js

## Description

Monier-Williams Sanskrit-English Dictionary in your browser.

## Features

The dictionary requires only a web browser to work (written entirely in JS6/HTML5/CSS3). 

The fully implemented features include:

- modern, responsive layout
- instantenous searches
- HK (Harvard-Kioto) or IAST used to input Sanskrit words 
- fulltext search (search keywords as well as word definitions)
- fuzzy searches (you need to know only part of a word to find it)
- highlighting searched words in results
- syntax highlighting (keywords, compounds, grammatical categories are in color)

## Usage

### Running the `mwsd-js`

Open `index.html` in a browser of your choice.

### Interface 

The upper part of the screen contains the search input field and a bunch of options.
The main part of the screen contains the short usage description.

At any time you may toggle options visibility using `Show/hide options` button.

### Looking up words 

To search for a word type it in the input field and press `Enter` or left-click `Search` button.

If the matches list does not fit the screen, scroll down to see them all.

Radio buttons below input field let you switch between `HK` and `IAST` for Sanskrit input.

To search for English words choose `English` input method.
It auto-enables `Fulltext search` as English words are only present in word definitions.

#### Fuzzy searches

You may use '\*' (asterix, `Shift-8` on most keyboards) in the input to indicate 'zero or more of any characters.'
This allows you to type in only a part of a word, e.g.:

- `\*man` will match all words that end in '-man' (including 'man').
- `ati\*` will match all words beginning with 'ati-' (including 'ati')
- `ati\*man` will match all words beginnig with 'ati-' and ending with '-man' (including 'atiman').
- `\*kara\*` will match all words with '-kara-' in any position (including 'kara' itself).

The searches containing only `\*` are illegal and will be silently dropped.

Be careful while using very short (e.g. two-letter) search terms with fuzzy search.
It may result in *long* searches and long lists of results (think: dozens of thousands of items).

Options: `Any word ending` and `beginning` are equivalent to `word\*` and `\*word` respectively.
Enable them if you want to use fuzzy search without constantly typing '\*'.

#### Fulltext search 

`Fulltext search` allows you to look through keywords and word definitions.

It lets you do a reverse search, e.g. to use MWSD as English-Sanskrit dictionary or to look up compounds that do not show in a keywords search.

If you search for Sanskrit words "fulltext" should be as fast as keyword only look-up.
It may take considerably longer (up to 10 seconds) if you search for short English words (definitions are mostly in English).

## Known issues

- devanagari sorting order (to be solved soon, source dictionary file has wrong (English) sorting order)

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

- search history
- search suggestions based on search history
- search suggestions based on dictionary keywords
- proper caching of search results

- adding support for pali-english dictionary

## Low priority

- Velthuis input method 
- option to display results using IAST instead of HK.
- color themes
- support for other dictionaries of indic languages
- extended syntax highlighting
