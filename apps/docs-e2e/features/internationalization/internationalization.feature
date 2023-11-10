Feature: Internationalization

  My page is available in multiple languages.
  Support languages are English and Japanese.

  Scenario Outline: Changing Language

    Given Alice is on the homepage in the <language> language
    When Alice selects <change_language> from the language menu
    Then The page is displayed to her in the <change_language>

    Examples:
      | language | change_language |
      | English  | Japanese        |
      | Japanese | English         |

